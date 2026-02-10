import { html } from '@rbardini/html'
import markdown, { markdownInline } from '../utils/markdown.js'
import DateTime from './date-time.js'
import Link from './link.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['publications']} publications
 * @returns {string | false}
 */
export default function Publications(publications = [], label = 'Publications') {
  if (!publications.length) return ''

  return html`
    <section id="publications">
      <h3>${label}</h3>
      <div class="stack">
        ${publications.map(
          ({ name, publisher, releaseDate, summary, url }) => html`
            <article>
              <header>
                <h4>${Link(url, name, { markdown: true })}</h4>
                <div class="meta">
                  ${publisher && html`<div>Published by <strong>${markdownInline(publisher)}</strong></div>`}
                  ${releaseDate && DateTime(releaseDate)}
                </div>
              </header>
              ${summary && markdown(summary)}
            </article>
          `,
        )}
      </div>
    </section>
  `
}
