import { html } from '@rbardini/html'
import colors from '../utils/colors.js'
import FloatingLinks from './floating-links.js'
import Footer from './footer.js'
import Header from './header.js'
import Meta from './meta.js'
import Sections from './sections.js'
import TableOfContents from './table-of-contents.js'

/** @typedef {{icons?: string, projectsByType?: boolean, showTableOfContents?: boolean, footer_left?: string, footer_right?: string}} ThemeOptions */

/**
 * @param {import('../schema.d.ts').ResumeSchema} resume
 * @param {object} [options]
 * @param {string} [options.css]
 * @param {string} [options.js]
 * @returns
 */
export default function Resume(resume, { css, js } = {}) {
  /** @type {ThemeOptions} */
  const themeOptions = resume.meta?.themeOptions || {}
  const iconSet = themeOptions.icons?.toLowerCase?.() === 'feather' ? 'feather' : 'fontawesome'
  const projectsByType = Boolean(themeOptions.projectsByType)
  const showTableOfContents = themeOptions.showTableOfContents !== false
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
        ${showTableOfContents ? TableOfContents(resume, { groupByType: projectsByType }) : ''}
        ${FloatingLinks(resume.meta)} ${Header(resume.basics, { iconSet })}
        ${Sections(resume, { groupByType: projectsByType })} ${Footer(resume)}
      </body>
    </html>`
}
