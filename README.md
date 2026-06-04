# Satyam Personal Website

A premium, minimalist personal website for writing, projects, learning progress, and a manually updated Now page.

## What to Customize

- Update your name, email, and social links in `scripts/data.js`.
- Add writing posts in the `articles` array inside `scripts/data.js`.
- Create a matching folder for each new article at `articles/my-new-slug/index.html`.
- Update projects, milestones, currently items, books, skills, and goals in `scripts/data.js`.
- Replace `assets/profile.png` with your real profile picture when ready.
- Replace every `https://example.com` URL with your real domain in `index.html`, `now/index.html`, article pages, `robots.txt`, `sitemap.xml`, and `feed.xml`.

## Local Preview

Run a small static server from this folder so absolute asset paths and ES modules resolve correctly:

```bash
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

You can also use the included npm script:

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Use the default static settings. No build command is required.
4. Set the output/publish directory to the project root.

## Deploy on Netlify

1. Push this folder to a GitHub repository.
2. Import the repository in Netlify.
3. Leave build command empty.
4. Set publish directory to `.`.

## Features Included

- Dark mode by default with saved light mode preference.
- Responsive layout for mobile, tablet, and desktop.
- Animated gradient background and scroll progress indicator.
- Centered circular profile image.
- Writing section with year grouping, search, tags, reading time, dates, and New badges.
- Individual article pages with reading progress.
- Project cards with status, technologies, GitHub, and demo links.
- Learning journey timeline and easy update panels.
- Data-driven Currently section for reading, learning, building, and thinking.
- Now page.
- Command palette navigation with `Ctrl + K` or `Cmd + K`.
- Local time display.
- RSS feed, sitemap, robots.txt, Open Graph tags, and structured data.
- Newsletter and visitor counter placeholders.
