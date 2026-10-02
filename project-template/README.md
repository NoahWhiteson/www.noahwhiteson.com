# Project pages

All five detail pages use `template.html`, `../project.css`, and `../project.js`.

Edit `projects.json` to change a project's name, colours, logo, product image, summary, features, facts, or external link. Asset names refer to the portfolio's `assets/` directory. Add another entry to the list to create another page; next-project links follow the list order.

Rebuild the static pages from the repository root:

```sh
python3 project-template/build.py
```

The generated pages are in `projects/<slug>/index.html`. Keep the generated files committed so the site works on any static host without a build step. The portfolio's card links live in the root `index.html`.

On desktop, native vertical scrolling moves a continuous horizontal ribbon. Media grows as it approaches the centre. Mobile, reduced-motion, and no-JavaScript layouts use a vertical document. Content and navigation also work without JavaScript.
