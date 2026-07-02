# Gemfile
#
# This project uses the `github-pages` gem, which pins Jekyll and every
# plugin to the EXACT versions GitHub's own Pages build servers use. As
# long as your gems come from this file, what you see with
# `bundle exec jekyll serve` locally is what will render on GitHub Pages.
#
# To edit: don't add random Jekyll plugins here — GitHub Pages only runs
# plugins from its supported whitelist. If you add a gem that isn't on
# https://pages.github.com/versions/ , the site will build locally but
# GitHub Pages will silently ignore the plugin (or fail) when you push.

source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins

# Ruby 3.0+ removed webrick from the standard library, but Jekyll's dev
# server depends on it. Harmless to keep even on older Rubies.
gem "webrick", "~> 1.8"

# Pinned only because this machine's Ruby is 2.6.10 (system Ruby on this
# Mac); newer nokogiri requires Ruby >= 3.0. GitHub Pages' own build
# servers ignore this pin and use whatever nokogiri github-pages resolves
# to, so this does not affect what gets deployed. If/when you upgrade to
# Ruby 3.x locally, remove this line.
gem "nokogiri", "~> 1.13.0"
