# jsonresume-theme-eventide

Fork of [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even), based on the `feat-multiple-features` branch and maintained as `jsonresume-theme-eventide`.

A flat [JSON Resume](https://jsonresume.org/) theme, compatible with the latest [resume schema](https://github.com/jsonresume/resume-schema).
Inspired by [jsonresume-theme-flat](https://github.com/erming/jsonresume-theme-flat).

- 💄 Markdown support
- 📐 CSS grid layout
- 🌗 Light and dark modes
- 🎨 Customizable colors
- 🧩 Standalone CLI
- 📦 ESM and CommonJS builds
- 🤖 TypeScript typings

[Repository →](https://github.com/zzamboni/jsonresume-theme-eventide)

## Installation

```console
npm install jsonresume-theme-eventide
```

## Usage

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
