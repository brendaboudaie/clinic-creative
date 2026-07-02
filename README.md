# clinic-creative

A Jekyll site built to run on GitHub Pages with zero custom plugins outside
GitHub's supported list. It ships with reusable layouts/includes and a
single design-token file so you can restyle or re-copy the site without
touching template code.

Only the homepage has real (placeholder) content right now — everything
else is scaffolding, ready for you to fill in.

## Running it locally

```sh
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000`. `jekyll serve` watches files and
rebuilds automatically — except `_config.yml`, which is only read on
startup, so restart the server after editing it.

> **Note on this machine's Ruby version:** this Mac has the old system
> Ruby (2.6.10) with an old Bundler. The Gemfile pins `nokogiri` to
> `~> 1.13.0` purely to keep it installable on that Ruby — GitHub's own
> Pages build servers ignore your Gemfile/Gemfile.lock for their build and
> use their own pinned versions, so this has no effect on the deployed
> site. If you later install a modern Ruby (3.x, e.g. via `rbenv`), remove
> that line — it isn't needed there. If `bundle install` ever complains
> about ancient Bundler again, install a compatible one first, e.g.
> `gem install bundler -v 2.4.22 --user-install`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo's **Settings → Pages**, set the source to your default
   branch (`main`), root folder.
3. In `_config.yml`, set `url` to your Pages URL (e.g.
   `https://yourusername.github.io`) and `baseurl` to `""` if this is a
   `<username>.github.io` repo, or `"/repo-name"` otherwise.

## Folder structure

```
_config.yml         Site settings, plugin list, collections, defaults
Gemfile              Gem dependencies (GitHub Pages-supported only)
index.md             Placeholder homepage (uses the "home" layout)

_data/
  theme.yml          Design tokens: colors, fonts, spacing, radius, buttons
  navigation.yml      Main nav links
  footer.yml          Footer copy and links

_layouts/
  default.html        Base HTML shell (head, nav, footer) — other layouts extend this
  home.html            Homepage layout
  page.html            Standard content page layout
  service.html         Service page layout
  audience.html        Audience/persona page layout (e.g. "For Dental")

_includes/
  head.html            <head> contents
  navigation.html      Header + main nav
  footer.html          Site footer
  button.html          Reusable button/CTA
  hero.html            Hero/banner section
  card.html            Single content block/card
  card-grid.html       Responsive grid that loops card.html over a list

_sass/
  _base.scss           Reset, typography, .container/.section utilities
  _buttons.scss        .btn styles, driven by theme.yml button variants
  _layout.scss          Header/nav/footer/card-grid structural CSS
  _components.scss      Hero, card, CTA band, testimonial visual styles

assets/
  css/main.scss         Generates CSS variables from theme.yml, imports _sass/*
  js/main.js             Minimal JS: just the mobile nav toggle
  images/                 Put images here (empty for now)

_services/             Collection for service pages (e.g. Teeth Whitening) — empty for now
_audiences/            Collection for audience pages (e.g. "For Dental") — empty for now
```

## The one file to edit for site-wide look and feel: `_data/theme.yml`

Every color, font, spacing value, corner radius, and button style used
anywhere on the site is defined once in `_data/theme.yml`. Nothing is
hardcoded in the Sass files.

How this works: `assets/css/main.scss` has Liquid front matter (the empty
`---` at the top), which lets Jekyll loop over `site.data.theme` and print
each value as a CSS custom property in `:root` before compiling the Sass.
For example, `colors.primary-dark` in the YAML becomes
`--color-primary-dark` in CSS. Every partial in `_sass/` then reads these
with `var(--color-primary-dark)`, etc.

**To change the site's palette, fonts, or spacing scale, edit
`_data/theme.yml` and reload the page** — no `.scss` editing required.

The one exception: adding a *brand new* button variant (beyond
`primary`/`secondary`/`outline-light`) also requires adding its name to
the `@each $variant in primary, secondary, outline-light` line in
`_sass/_buttons.scss`, since Sass partials aren't run through Liquid and
can't loop over the YAML data directly.

## Editing navigation and footer content

- `_data/navigation.yml` — the header menu. Add/remove/reorder entries;
  `_includes/navigation.html` just loops over this list.
- `_data/footer.yml` — footer tagline, link columns, and social links.

Both are consumed by their respective includes, so you never need to
touch HTML to update these.

## The includes (small, reusable pieces)

- **`button.html`** — `{% include button.html text="Book a Consult" url="/contact/" style="primary" %}`.
  `style` is `primary` (default), `secondary`, or `outline-light`.
- **`hero.html`** — used by the home/service/audience layouts, populated
  from each page's `hero:` front matter (see below). Not usually included
  by hand.
- **`card.html`** — a single card: `title`, `text`, `icon` or `image`,
  optional `url` (makes the whole card a link) and `cta_text`.
- **`card-grid.html`** — loops `card.html` over an array, e.g.
  `{% include card-grid.html cards=page.benefits columns=3 %}`.

Open any file in `_includes/` — each has a comment block at the top (a
Liquid comment, so it never renders into the page) documenting its
parameters and giving a usage example.

## The layouts

- **`default.html`** — the shared shell every page ultimately renders
  inside (`<head>`, header/nav, `{{ content }}`, footer, JS tag). You
  rarely need to touch this directly.
- **`home.html`** — set `layout: home` in front matter (already done in
  `index.md`). Reads `hero:`, `cards:` / `cards_title:` /
  `cards_columns:`, and `cta:` from front matter — each section only
  renders if its front matter is present.
- **`page.html`** — standard content pages (About, Contact, etc). This is
  applied automatically to any plain page via the `defaults:` block in
  `_config.yml`, so a new `.md` file usually just needs `title:`.
- **`service.html`** — for files in `_services/`. Reads `title`/`subtitle`
  (or an overriding `hero:` block), an optional `benefits:` card grid, and
  an optional closing `cta:` band.
- **`audience.html`** — for files in `_audiences/`. Same shape as
  `service.html`, plus an optional `testimonial:` block.

## Adding new content

**A standard page** (About, Contact, etc.) — create e.g. `about.md` at
the project root:

```yaml
---
title: About
subtitle: Optional subheading
---
Your Markdown content here.
```

No `layout:` needed — `_config.yml` defaults it to `page`.

**A service page** — create a file in `_services/`, e.g.
`_services/teeth-whitening.md` (becomes `/services/teeth-whitening/`):

```yaml
---
title: Teeth Whitening
subtitle: A brighter smile in one visit.
benefits_title: Why patients choose us
benefits:
  - title: Fast results
    text: Most patients see a visible difference after one session.
    icon: "⚡"
  - title: Gentle on enamel
    text: Dentist-supervised formulas that protect your teeth.
    icon: "🦷"
cta:
  title: Ready to book?
  text: Get in touch to schedule a consultation.
  button_text: Book a Consult
  button_url: /contact/
---
Any extra Markdown copy goes here, between the hero and the benefits grid.
```

**An audience page** — create a file in `_audiences/`, e.g.
`_audiences/dental.md` (becomes `/for/dental/`). Same shape as a service
page, plus an optional `testimonial: { quote: "...", author: "..." }`.

After adding pages, remember to add matching entries to
`_data/navigation.yml` if they should appear in the header menu.

## Keeping JavaScript minimal

`assets/js/main.js` only handles the mobile nav toggle — on purpose. If
you need more interactivity later, add small, focused scripts rather than
growing this file into a general-purpose bundle.
