# jsonresume-theme-even

[![npm package version](https://img.shields.io/npm/v/jsonresume-theme-even.svg)](https://www.npmjs.com/package/jsonresume-theme-even)
[![Build status](https://img.shields.io/github/actions/workflow/status/rbardini/jsonresume-theme-even/main.yml)](https://github.com/rbardini/jsonresume-theme-even/actions)
[![Deploy status](https://img.shields.io/netlify/7c0cb4f0-e270-4085-8f75-a8850cf45b2a?label=deploy)](https://app.netlify.com/sites/jsonresume-theme-even/deploys)
[![Code coverage](https://img.shields.io/codecov/c/github/rbardini/jsonresume-theme-even.svg)](https://codecov.io/gh/rbardini/jsonresume-theme-even)
[![Dependencies status](https://img.shields.io/librariesio/release/npm/jsonresume-theme-even)](https://libraries.io/npm/jsonresume-theme-even)

A flat [JSON Resume](https://jsonresume.org/) theme, compatible with the latest [resume schema](https://github.com/jsonresume/resume-schema).
Inspired by [jsonresume-theme-flat](https://github.com/erming/jsonresume-theme-flat).

- 💄 Markdown support
- 📐 CSS grid layout
- 🌗 Light and dark modes
- 🎨 Customizable colors
- 🧩 Standalone CLI
- 📦 ESM and CommonJS builds
- 🤖 TypeScript typings

[View demo →](https://jsonresume-theme-even.rbrd.in)

## Installation

```console
npm install jsonresume-theme-even
```

## Usage

### With resume-cli

[resume-cli](https://github.com/jsonresume/resume-cli) comes with _Even_ and uses it by default, so you don't even (pun intended) need to install the theme yourself:

```console
npm install resume-cli
npx resume export resume.html
```

### With Resumed

[Resumed](https://github.com/rbardini/resumed) requires you to install the theme, since it does not come with any by default. It will then automatically load and use _Even_ when rendering a resume:

```console
npm install resumed jsonresume-theme-even
npx resumed render --theme jsonresume-theme-even
```

### Standalone usage

_Even_ comes with a barebones CLI that reads resumes from `stdin` and outputs HTML to `stdout`. This allows usage without any resume builder tools:

```console
npx jsonresume-theme-even < resume.json > resume.html
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

By default, [Feather icons](https://feathericons.com/) are used for the profiles. You can also use [Font Awesome icons](https://fontawesome.com/) by setting the `.meta.themeOptions.icons` resume field to "fontawesome":

```json
{
  "meta": {
    "themeOptions": {
      "icons": "fontawesome"
    }
  }
}
```

### Certificate badges and notes

If a [certificate](https://docs.jsonresume.org/schema#certificates) entry contains an `image` field, it is used as the URL of an image to display next to the entry as a badge for the certificate.

If a certificate entry contains only `name` and optionally `url` but no `issuer` or `date`, it is considered as a "note" entry and rendered at the top of the list in a different format (for example to link to a full list).

### Grouping projects by type

If the `.meta.themeOptions.projectsByType` is `true`, project entries are rendered as separate sections according to their `type` field, instead of as a single section.

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

### Versions/Downloads bar

You can add a small versions/downloads bar at the top by setting `.meta.themeOptions.versions` (and optionally `.meta.themeOptions.downloads`) to a map of label → URL:

```json
{
  "meta": {
    "themeOptions": {
      "versions": {
        "PDF": "/vita/zamboni-vita.pdf",
        "Leadership": "/vita/roles/leadership/"
      },
      "downloads": {
        "BibTeX": "/vita/publications/zamboni-pubs.bib"
      }
    }
  }
}
```
