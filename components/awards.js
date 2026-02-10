import { html } from '@rbardini/html'
import markdown, { markdownInline } from '../utils/markdown.js'
import DateTime from './date-time.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['awards']} awards
 * @returns {string | false}
 */
export default function Awards(awards = [], label = 'Awards') {
  if (!awards.length) return ''

  return html`
    <section id="awards">
      <h3>${label}</h3>
      <div class="stack">
        ${awards.map(
          ({ awarder, date, summary, title }) => html`
            <article>
              <header>
                <h4>${title && markdownInline(title)}</h4>
                <div class="meta">
                  ${awarder && html`<div>Awarded by <strong>${markdownInline(awarder)}</strong></div>`}
                  ${date && DateTime(date)}
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
