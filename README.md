# Noah Whiteson — Portfolio

The complete static portfolio, including the animated hero, holographic project cards, scrolling typography, and dot reveal into the contact footer.

## Run locally

From this folder, start a local server:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. No dependencies or build step are required.

## Files

- `index.html` — page content, project links, and contact details
- `style.css` — layout, gradients, responsive styling, and card finishes
- `script.js` — scroll animations, pointer reflections, and card interactions
- `assets/` — project logos, images, and local fonts

## Hosting

Upload the contents of this folder to any static web host. The entry point is `index.html`; keep `assets/` alongside it. No environment variables or API keys are needed.

## Editing

Update project descriptions and links in `index.html`, colours and sizing in `style.css`, and animation timing in `script.js`. The site automatically respects the operating system’s reduced-motion setting. Contact links point to `contact@noahwhiteson.com`.
