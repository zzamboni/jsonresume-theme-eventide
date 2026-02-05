import { html } from '@rbardini/html'
import colors from '../utils/colors.js'
import Header from './header.js'
import Meta from './meta.js'
import Sections from './sections.js'
import TableOfContents from './table-of-contents.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema} resume
 * @param {object} [options]
 * @param {string} [options.css]
 * @param {string} [options.js]
 * @returns
 */
export default function Resume(resume, { css, js } = {}) {
  const iconSet = resume.meta?.themeOptions?.icons?.toLowerCase?.() === 'fontawesome' ? 'fontawesome' : 'feather'
  const projectsByType = Boolean(resume.meta?.themeOptions?.projectsByType)
  const showTableOfContents = Boolean(resume.meta?.themeOptions?.showTableOfContents)
  return html`<!doctype html>
    <html lang="en" style="${colors(resume.meta)}">
      <head>
        <meta charset="utf-8" />
        ${Meta(resume.basics)}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" />
        ${css &&
        html`<style>
          ${css}
        </style>`}
        ${js &&
        html`<script type="module">
          ${js}
        </script>`}
      </head>
      <body id="top">
        ${showTableOfContents && TableOfContents(resume, { groupByType: projectsByType })}
        ${Header(resume.basics, { iconSet })} ${Sections(resume, { groupByType: projectsByType })}
      </body>
    </html>`
}
