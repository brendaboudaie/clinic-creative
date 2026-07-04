# Clinic Creative

The Jekyll source for [thecliniccreative.com](https://thecliniccreative.com),
built to run on GitHub Pages with zero custom plugins outside GitHub's
supported list. It ships with reusable layouts/includes and a single
design-token file so the site can be restyled or re-copied without touching
template code.

Content, navigation, and design tokens are all defined in `_data/` and plain
Markdown pages — the `_layouts/`/`_includes/` templates should rarely need to
change again.

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
3. The `CNAME` file at the repo root already points at
   `thecliniccreative.com` — once the domain is purchased, add the DNS
   records GitHub Pages asks for and it will connect automatically. Until
   then, the site is reachable at the repo's default `github.io` URL.

## Folder structure

```
_config.yml         Site settings, plugins, permalink style, per-folder layout defaults
CNAME                Custom domain for GitHub Pages (thecliniccreative.com)
Gemfile              Gem dependencies (GitHub Pages-supported only)

index.md             Homepage (layout: home)
about.md              About page (layout: about)
contact.md            Contact page (layout: contact)

services/            "What We Do" — hub page + one file per service
  index.md              /services/  (layout: vertical-landing)
  website-design.md      /services/website-design/
  logo-branding.md       /services/logo-branding/
  seo.md                 /services/seo/
  website-maintenance.md /services/website-maintenance/

dental/               "For Dental" — hub page + one file per specialty
  index.md               /dental/  (layout: vertical-landing)
  general-dentistry.md, orthodontic.md, cosmetic-dentistry.md  (Phase 1)
  (remaining specialties are Phase 2 — see _data/dental_specialties.yml)

medical/              "For Medical" — hub page + one file per specialty
  index.md               /medical/  (layout: vertical-landing)
  family-medicine.md, dermatology.md, med-spa.md  (Phase 1)
  (remaining specialties are Phase 2 — see _data/medical_specialties.yml)

_data/
  theme.yml            Design tokens: colors, fonts, spacing, radius, buttons
  navigation.yml        Mega-menu structure (top-level items + dropdown children)
  footer.yml             Footer copy and links
  services.yml            The 4 services (title, url, description, icon)
  dental_specialties.yml   All dental specialties (7) — `page: true` ones are live
  medical_specialties.yml  All medical specialties (8) — `page: true` ones are live
  testimonials.yml         Client quotes — empty until collected; section auto-hides

_layouts/
  default.html          Base HTML shell (head, nav, footer) — other layouts extend this
  home.html              Homepage: hero, stats, who-we-help, services, why-us, process, testimonials
  page.html              Generic content page (fallback layout)
  service.html            Individual service page (What We Do)
  specialty-vertical.html  Individual dental/medical specialty page
  vertical-landing.html    Hub page for /services/, /dental/, /medical/
  about.html               About page
  contact.html             Contact page

_includes/
  head.html            <head> contents (title, meta, fonts, SEO tag)
  navigation.html       Header + mega-menu nav, driven by navigation.yml
  footer.html            Site footer
  button.html            Reusable button/CTA
  hero.html              Hero/banner section
  card.html              Single content block/card
  card-grid.html          Responsive grid that loops card.html over a list
  cta-block.html          Reusable closing call-to-action band
  stats.html              "By the numbers" stat strip
  testimonial.html        Single client-quote block

_sass/
  _base.scss           Reset, typography, .container/.section utilities, fade-in-up
  _buttons.scss         .btn styles, driven by theme.yml button variants
  _layout.scss           Header/mega-menu/footer/card-grid structural CSS
  _components.scss       Hero, card, stats, CTA band, testimonial visual styles

assets/
  css/main.scss         Generates CSS variables from theme.yml, imports _sass/*
  js/main.js             Mobile nav toggle, mega-menu touch handling, scroll fade-in
  images/                 Put images here (empty for now — pages use placeholder boxes)
```

## The one file to edit for site-wide look and feel: `_data/theme.yml`

Every color, font, spacing value, corner radius, and button style used
anywhere on the site is defined once in `_data/theme.yml`. Nothing is
hardcoded in the Sass files.

`assets/css/main.scss` has Liquid front matter (the empty `---` at the
top), which lets Jekyll loop over `site.data.theme` and print each value as
a CSS custom property in `:root` before compiling the Sass. For example,
`colors.accent` in the YAML becomes `--color-accent` in CSS. Every partial
in `_sass/` then reads these with `var(--color-accent)`, etc.

**To change the site's palette, fonts, or spacing scale, edit
`_data/theme.yml` and reload the page** — no `.scss` editing required.

The one exception: adding a *brand new* button variant (beyond
`primary`/`secondary`) also requires adding its name to the
`@each $variant in primary, secondary` line in `_sass/_buttons.scss`,
since Sass partials aren't run through Liquid and can't loop over the YAML
data directly.

## Editing navigation, footer, services, and specialties

- `_data/navigation.yml` — the mega-menu. Each top-level item has its own
  `url` (it's always a real landing page, never just a dropdown trigger)
  and an optional `children` list for the hover/tap dropdown.
- `_data/footer.yml` — footer tagline and link columns.
- `_data/services.yml` — the 4 services shown on the homepage, the
  `/services/` hub, and each specialty page's "services in context" grid.
- `_data/dental_specialties.yml` / `_data/medical_specialties.yml` — every
  specialty in the brief's IA. Entries with `page: true` have a real page
  and are linked from the hub grid and nav; the rest render as
  "coming soon" text until their page is written (add the file, flip
  `page: true`, and it's live everywhere automatically).
- `_data/testimonials.yml` — add `{ quote, author }` entries here and the
  homepage testimonials section appears automatically.

None of these require touching HTML.

## Placeholder content still to replace

- **Contact info** (`_config.yml`: `email`, `phone`, `address`) —
  currently marked `PLACEHOLDER`.
- **About page bio** (`about.md`) — currently a draft; replace with
  Brenda's real bio and headshot.
- **Contact form** (`contact.md` / `_layouts/contact.html`) — the form
  markup has no backend wired up yet; the `action` attribute has a
  comment showing where to plug in Formspree/Getform/etc. The Calendly
  embed is a placeholder div.
- **Images** — hero mockups, portfolio pieces, and headshots are all
  placeholder boxes (`.placeholder-box`) since no real assets were
  provided yet. Drop files into `assets/images/` and swap the
  `placeholder-box` markup for `<img>` tags where noted.

## Adding new content

**A standard page** — create e.g. `foo.md` at the project root:

```yaml
---
title: Foo
---
Your Markdown content here.
```

No `layout:` needed — `_config.yml` defaults it to `page`.

**A new service page** — add a file in `services/`, matching the shape of
the existing ones (front matter: `title`, `description`, `headline`,
`what_included`, `process`, `starting_price`, `cta`).

**A new specialty page** — add a file in `dental/` or `medical/`, matching
the shape of the existing ones (front matter: `specialty`, `headline`,
`subheadline`, `pain_point`, `cta`), then flip that specialty's `page:`
flag to `true` in the matching `_data/*_specialties.yml` file and add it to
`_data/navigation.yml`'s dropdown if it should appear in the mega-menu.

## Keeping JavaScript minimal

`assets/js/main.js` only handles the mobile nav toggle, mega-menu touch
support, and a small scroll-triggered fade-in — on purpose. If you need
more interactivity later, add small, focused scripts rather than growing
this file into a general-purpose bundle.
