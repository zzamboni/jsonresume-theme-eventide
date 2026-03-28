# jsonresume-theme-eventide

[![npm package version](https://img.shields.io/npm/v/jsonresume-theme-eventide.svg)](https://www.npmjs.com/package/jsonresume-theme-eventide)
[![Build status](https://img.shields.io/github/actions/workflow/status/zzamboni/jsonresume-theme-eventide/main.yml)](https://github.com/zzamboni/jsonresume-theme-eventide/actions)

Example: https://zzamboni.org/vita/

A flat [JSON Resume](https://jsonresume.org/) theme, compatible with the latest [resume schema](https://github.com/jsonresume/resume-schema). Fork of [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even) (forked from jsonresume-theme-even@0.26.1).

- 💄 Markdown support
- 📐 CSS grid layout
- 🌗 Light and dark modes
- 🎨 Customizable colors
- 🧩 Standalone CLI
- 📦 ESM and CommonJS builds
- 🤖 TypeScript typings
- 🖼️ Support for FontAwesome and Feather icons
- 🏅 Support for certificate badges
- 📝 Support for "note" entries in publications, certificates and projects
- 🗂️ Auto-grouping of project entries by type
- 🏷️ Customizable section labels and ordering
- 📚 Table of contents
- 🔗 Configurable floating links in the bottom-right of the theme

[Repository →](https://github.com/zzamboni/jsonresume-theme-eventide)

## Installation

```console
npm install jsonresume-theme-eventide
```

## Usage

### With resume-toolkit

This theme is bundled and automatically used by [resume-toolkit](https://github.com/zzamboni/resume-toolkit), which produces both HTML and PDF outputs:

```console
wget https://raw.githubusercontent.com/zzamboni/resume-toolkit/refs/heads/main/build-resume.sh
chmod a+rx build-resume.sh
./build-resume resume.json --serve # Access at https://localhost:8080/
```

### With resume-cli

[resume-cli](https://github.com/jsonresume/resume-cli) does not bundle this fork, so install it explicitly and select it by name:

```console
npm install resume-cli jsonresume-theme-eventide
npx resume export resume.html --theme jsonresume-theme-eventide
```

### With Resumed

[Resumed](https://github.com/rbardini/resumed) requires you to install the theme, since it does not come with any by default. It will then automatically load and use _Eventide_ when rendering a resume:

```console
npm install resumed jsonresume-theme-eventide
npx resumed render --theme jsonresume-theme-eventide
```

### Standalone usage

_Eventide_ comes with a barebones CLI that reads resumes from `stdin` and outputs HTML to `stdout`. This allows usage without any resume builder tools:

```console
npx jsonresume-theme-eventide < resume.json > resume.html
```

## Options

### Colors

You can override theme colors via the `.meta.themeOptions.colors` resume field. Each entry defines a tuple of light and (optional) dark color values. If only one array value is defined, it will be used in both light and dark modes.

Here's an example using the default theme colors:

```json
{
  "meta": {
    "themeOptions": {
      "colors": {
        "background": ["#ffffff", "#191e23"],
        "dimmed": ["#f3f4f5", "#23282d"],
        "primary": ["#191e23", "#fbfbfc"],
        "secondary": ["#6c7781", "#ccd0d4"],
        "accent": ["#0073aa", "#00a0d2"]
      }
    }
  }
}
```

### Icons

By default, [Font Awesome icons](https://fontawesome.com/) are used for the profile and contact links. You can switch to [Feather icons](https://feathericons.com/) by setting the `.meta.themeOptions.icons` resume field to `"feather"`:

```json
{
  "meta": {
    "themeOptions": {
      "icons": "feather"
    }
  }
}
```

### Certificate badges

If a [certificate](https://docs.jsonresume.org/schema#certificates) entry contains an `image` field, it is used as the URL of an image to display next to the entry as a badge for the certificate.

If a certificate entry contains only `name` and optionally `url` but no `issuer` or `date`, it is considered as a "note" entry and rendered at the top of the list in a different format (for example to link to a full list).

### Grouping projects by type

If the `.meta.themeOptions.projectsByType` is `true`, project entries are rendered as separate sections according to their `type` field, instead of as a single section. Per-type sections can also be reordered and configured with custom labels.

### Sections

#### Ordering

You can override what sections are displayed, and in what order, via the `.meta.themeOptions.sections` resume field.

Here's an example with all available sections in their default order:

```json
{
  "meta": {
    "themeOptions": {
      "sections": [
        "work",
        "volunteer",
        "education",
        "projects",
        "awards",
        "certificates",
        "publications",
        "skills",
        "languages",
        "interests",
        "references"
      ]
    }
  }
}
```

Any sections not in the above list are not registered and won't be displayed in the final render.

#### Custom Labels

You can override the default section labels. Particularly useful if you want to translate a resume into another language.

```json
{
  "meta": {
    "themeOptions": {
      "sectionLabels": {
        "work": "Jobs",
        "projects": "Projekter"
      }
    }
  }
}
```

If `.meta.themeOptions.projectsByType` is `true`, you can also break out project types into individually ordered sections by using `projects:<type>` entries. For example:

```json
{
  "meta": {
    "themeOptions": {
      "projectsByType": true,
      "sections": ["work", "projects:application", "projects:library", "skills"],
      "sectionLabels": {
        "projects:application": "Apps",
        "projects:library": "Libraries"
      }
    }
  }
}
```

### Table of contents

You can enable a floating table of contents on the right side of the screen by setting `.meta.themeOptions.showTableOfContents` to `true`:

```json
{
  "meta": {
    "themeOptions": {
      "showTableOfContents": true
    }
  }
}
```

The table of contents automatically includes links to all resume sections that have content, plus a "Top" link to return to the beginning of the document. The active section is highlighted as you scroll through the resume. The table of contents is automatically hidden on smaller screens and in print mode.

### Floating links

You can add floating action links in the bottom-right corner by setting `.meta.themeOptions.links` to an array of `{ name, url, icon }` objects. The `icon` value can be a plain Font Awesome name like `github`, or a Font Awesome class-style string copied from their site such as `fa-regular fa-file-pdf` or `fa-brands fa-github`.

```json
{
  "meta": {
    "themeOptions": {
      "links": [
        { "name": "PDF", "url": "/vita/zamboni-vita.pdf", "icon": "file-pdf" },
        { "name": "GitHub", "url": "https://github.com/zzamboni", "icon": "github" }
      ]
    }
  }
}
```

### Note fields

The theme supports lightweight "note-style" entries in a few places. These are useful for linking to a fuller external list, adding a short explanatory entry, or including a simple item without the full metadata normally associated with that section.

- In `certificates`, an entry with `name` and optionally `url`, but without `issuer`, `date`, or `image`, is treated as a note entry and rendered at the top of the certificates list.
- In `publications`, an entry with `name` and optionally `url`, but without `publisher`, `releaseDate`, or `summary`, is treated as a note entry and rendered at the top of the publications list.
- In `projects`, project note entries can be rendered by omitting all fields except for `description` and `type` if needed.

Examples:

```json
{
  "certificates": [{ "name": "Full certificate list", "url": "https://example.com/certificates" }],
  "publications": [{ "name": "Full publication list", "url": "https://example.com/publications" }],
  "projects": [
    {
      "name": "Side project archive",
      "url": "https://example.com/projects",
      "description": "A collection of smaller experiments and prototypes."
    }
  ]
}
```

## Release Process

To publish a new release, bump the package version and push the commit together with its tag:

```console
npm version patch
git push --follow-tags
```

Pushing a `v*` tag triggers the GitHub Actions publish workflow, which runs the checks and publishes the package to npm automatically.

If you need to re-test the publish workflow without bumping the version, you can delete and recreate the tag:

```console
git tag -d v0.27.3
git push origin :refs/tags/v0.27.3
git tag v0.27.3
git push origin v0.27.3
```

You can automate the normal release flow with `mise`:

```console
mise run release patch
```
