# Project pages

All five project pages share `template.html`, `../project.css`, and `../project.js`.

Edit `projects.json` for the summary, features, facts, links, and original assets. The `design` mapping in `build.py` controls each project’s palette, headline, preview asset, and framing. Crop coordinates are `(x, y, width, height)` in source-image pixels; images are framed in CSS without changing the original files.

Run from the repository root:

```sh
python3 project-template/build.py
```

Commit the generated pages in `projects/<slug>/index.html` for static hosting. Homepage card links stay in the root `index.html`.

Motion follows native vertical scrolling: a layered hero mark inside a level frame and a curved sentence whose dot reveals the next project. Interface previews and project details use static layouts. Reduced-motion and no-JavaScript layouts keep all content and links visible in a normal vertical document.
