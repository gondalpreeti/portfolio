# Preeti Gondal, portfolio

React + Vite single-page portfolio. Static output, no server needed.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build
```bash
npm run build      # outputs to dist/
npm run preview    # serve the built site locally
```

## Deploy (pick one)
- **Netlify** (you already use it): drag the `dist/` folder into the Netlify dashboard, or connect the GitHub repo. Build command `npm run build`, publish directory `dist` (set in `netlify.toml`).
- **Vercel**: import the repo. Framework preset "Vite" works with no changes.
- **GitHub Pages**: push `dist/` to a `gh-pages` branch, or use a Pages action. Paths are relative (`base: './'`), so a sub-path such as `/portfolio/` works.

## Where to edit things
- `src/data.js`: all text content (projects, skills, positions, activities, links, stats). This is the file to update when your CV changes.
- `public/preeti.jpg`: your photo (4:5 ratio, about 800x1000 works best).
- `public/resume-preeti-gondal.pdf`: the file behind the Download resume buttons. Replace it with the same name to update the CV.
- `src/styles.css`: colours are CSS variables at the top (`--purple`, `--emerald`, `--gold`, `--paper`).
- `index.html`: page title, description and social preview tags.

## Before you go live
- Add a live-demo or GitHub link to each project in `src/data.js` if you have one.
- Set the final site URL in `index.html` (`og:image` should be an absolute URL once the domain is known).
- Fonts load from Google Fonts. For a fully self-hosted site, download Marcellus and Instrument Sans and add them with `@font-face`.
