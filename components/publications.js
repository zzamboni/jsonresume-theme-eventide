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

  /** @param {NonNullable<import('../schema.d.ts').ResumeSchema['publications']>[number]} p */
  const isNote = p => p && p.name && !p.publisher && !p.releaseDate && !p.summary
  const notes = publications.filter(isNote)
  const items = publications.filter(p => !isNote(p))
  const noteEntries =
    notes.length > 0
      ? notes.map(
          ({ name, url }) => html`
            <article class="note-entry">
              <header>
                <div class="meta">${Link(url, name, { markdown: true })}</div>
              </header>
            </article>
          `,
        )
      : ''

  return html`
    <section id="publications">
      <h3>${label}</h3>
      <div class="stack">
        ${noteEntries}
        ${items.map(
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
