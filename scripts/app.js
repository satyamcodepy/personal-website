import { about, articles, currently, learning, milestones, now, projects, site } from "./data.js";

const root = document.documentElement;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const themeStorageKey = "theme-editorial";

function createLeaves() {
  const leaves = ['🍂', '🍁', '🍃', '🌿'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:1000;pointer-events:none;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const leaf = document.createElement('span');
      leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      leaf.style.cssText = `position:absolute;font-size:${Math.random()*16+12}px;pointer-events:none;`;
      container.appendChild(leaf);

      let x = -40;
      let y = Math.random() * window.innerHeight;
      let rotation = 0;
      let opacity = 0;
      const speed = Math.random() * 4 + 4;
      const drift = (Math.random() - 0.5) * 2;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        x += speed;
        y += drift;
        rotation += 3;
        opacity = elapsed < 200 ? elapsed / 200 : elapsed > 1600 ? Math.max(0, 1 - (elapsed - 1600) / 400) : 1;
        leaf.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        leaf.style.opacity = opacity;
        if (x < window.innerWidth + 50) {
          requestAnimationFrame(animate);
        } else {
          leaf.remove();
        }
      }
      requestAnimationFrame(animate);
    }, i * 40);
  }

  setTimeout(() => container.remove(), 3000);
}

function setTheme(theme) {
  createLeaves();
  const overlay = document.querySelector('.wind-overlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 600);
  }
  root.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);
}

function initTheme() {
  const saved = localStorage.getItem(themeStorageKey);
  const theme = saved || "dark";
  root.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);
  const btn = document.querySelector("[data-theme-toggle]");
  if (btn) btn.textContent = theme === "dark" ? "🌙" : "☀️";

  $("[data-theme-toggle]")?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
    document.querySelector("[data-theme-toggle]").textContent = next === "dark" ? "🌙" : "☀️";
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function renderSocials() {
  const html = site.socials.map((item) => `<a href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a>`).join("");
  $$("[data-socials], [data-socials-compact]").forEach((node) => { node.innerHTML = html; });
}

function renderCurrently() {
  const node = $("[data-currently]");
  if (!node) return;
  node.innerHTML = currently.map((item) => `
    <article class="currently-item">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderAbout() {
  const node = $("[data-about]");
  if (!node) return;
  node.innerHTML = about.map((item) => `
    <article class="about-card">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

let activeTag = "All";

function renderTagFilters() {
  const node = $("[data-tags]");
  if (!node) return;
  const tags = ["All", ...new Set(articles.flatMap((article) => [article.category, ...article.tags]))];
  node.innerHTML = tags.map((tag) => `<button class="pill" type="button" data-tag="${tag}" aria-pressed="${tag === activeTag}">${tag}</button>`).join("");
  node.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tag]");
    if (!button) return;
    activeTag = button.dataset.tag;
    renderTagFilters();
    renderArticles();
  }, { once: true });
}

function articleMatches(article, query) {
  const haystack = [article.title, article.excerpt, article.category, ...article.tags].join(" ").toLowerCase();
  const tagMatch = activeTag === "All" || article.category === activeTag || article.tags.includes(activeTag);
  return tagMatch && haystack.includes(query.toLowerCase());
}

function renderArticles() {
  const node = $("[data-articles]");
  if (!node) return;
  const query = $("[data-search]")?.value || "";
  const filtered = articles.filter((article) => articleMatches(article, query));
  const byYear = filtered.reduce((groups, article) => {
    const year = new Date(`${article.date}T00:00:00`).getFullYear();
    groups[year] ||= [];
    groups[year].push(article);
    return groups;
  }, {});

  node.innerHTML = Object.keys(byYear).sort((a, b) => b - a).map((year) => `
    <section class="year-group" aria-label="${year} articles">
      <h3>${year}</h3>
      <div class="article-list">
        ${byYear[year].map((article) => `
          <a class="article-link" href="/articles/${article.slug}/">
            <span>
              <span class="article-title">${article.title}${article.isNew ? '<span class="badge">New</span>' : ""}</span>
              <span class="article-excerpt">${article.excerpt}</span>
              <span class="article-meta">${formatDate(article.date)} &middot; ${article.readingTime} &middot; ${article.category}</span>
            </span>
            <span class="article-tags">${article.tags.map((tag) => `<span>${tag}</span>`).join("")}</span>
          </a>
        `).join("")}
      </div>
    </section>
  `).join("") || `<p class="article-excerpt">No notes found. Try another search.</p>`;
}

function renderProjects() {
  const node = $("[data-projects]");
  if (!node) return;
  node.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-image" aria-hidden="true">${project.imageLabel}</div>
      <div class="project-card__body">
        <div class="project-card__top">
          <h3>${project.title}</h3>
          <span class="badge">${project.status}</span>
        </div>
        <p>${project.description}</p>
        <div class="tech-list">${project.technologies.map((tech) => `<span class="tech">${tech}</span>`).join("")}</div>
        <div class="project-links">
          <a href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${project.demo}">Live demo</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderLearning() {
  const milestoneNode = $("[data-milestones]");
  const learningNode = $("[data-learning]");
  if (milestoneNode) {
    milestoneNode.innerHTML = milestones.map((item) => `
      <article class="milestone">
        <span class="article-meta">${item.date}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join("");
  }
  if (learningNode) {
    learningNode.innerHTML = learning.map((item) => `
      <article class="learning-item">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join("");
  }
}

function renderNow() {
  const node = $("[data-now]");
  if (!node) return;
  $("[data-now-updated]").textContent = now.updated;
  node.innerHTML = now.sections.map((section) => `
    <article class="now-card">
      <h3>${section.title}</h3>
      <ul>${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderArticlePage() {
  const page = $("[data-article-page]");
  if (!page) return;
  const slug = page.dataset.articlePage;
  const article = articles.find((item) => item.slug === slug);
  if (!article) {
    page.innerHTML = "<p>Article not found.</p>";
    return;
  }
  document.title = `${article.title} - ME`;
  page.innerHTML = `
    <header class="article-hero">
      <a class="pill" href="/">← Back</a>
      <p class="eyebrow">${article.category}</p>
      <h1>${article.title}</h1>
      <p class="article-meta">${formatDate(article.date)} &middot; ${article.readingTime}</p>
    </header>
    <article class="article-body">
      ${article.content.map(([type, text]) => type === "h2" ? `<h2>${text}</h2>` : type === "blockquote" ? `<blockquote>${text}</blockquote>` : `<p>${text}</p>`).join("")}
    </article>
  `;
}

function initProgress() {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? (scrollY / max) * 100 : 0;
    document.documentElement.style.setProperty("--progress", `${progress}%`);
    document.documentElement.style.setProperty("--article-progress", `${progress}%`);
  };
  update();
  addEventListener("scroll", update, { passive: true });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((item) => observer.observe(item));
}

function initTime() {
  const node = $("[data-local-time]");
  if (!node) return;
  const update = () => {
    node.textContent = new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    }).format(new Date());
  };
  update();
  setInterval(update, 30000);
}

function initCommandPalette() {
  const dialog = $("[data-command-palette]");
  const input = $("[data-command-input]");
  const list = $("[data-command-list]");
  if (!dialog || !input || !list) return;
  const commands = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/#blog" },
    { label: "Projects", href: "/#projects" },
    { label: "Connect", href: "/#connect" }
  ];
  const draw = () => {
    const query = input.value.toLowerCase();
    list.innerHTML = commands
      .filter((command) => command.label.toLowerCase().includes(query))
      .map((command) => `<button class="command-item" type="button" data-href="${command.href}">${command.label}</button>`)
      .join("");
  };
  const open = () => {
    draw();
    dialog.showModal();
    input.focus();
  };
  $("[data-command-open]")?.addEventListener("click", open);
  addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
    if (event.key === "Escape" && dialog.open) dialog.close();
  });
  input.addEventListener("input", draw);
  list.addEventListener("click", (event) => {
    const item = event.target.closest("[data-href]");
    if (!item) return;
    location.href = item.dataset.href;
    dialog.close();
  });
}

function initArticleSearch() {
  $("[data-search]")?.addEventListener("input", renderArticles);
}

function init() {
  createLeaves();
  initTheme();
  renderSocials();
  renderCurrently();
  renderAbout();
  renderTagFilters();
  renderArticles();
  renderProjects();
  renderLearning();
  renderNow();
  renderArticlePage();
  initArticleSearch();
  initProgress();
  initReveal();
  initTime();
  initCommandPalette();
  $("[data-year]") && ($("[data-year]").textContent = new Date().getFullYear());
}

init();