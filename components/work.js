import { html } from '@rbardini/html'
import markdown, { markdownInline } from '../utils/markdown.js'
import DateTimeDuration from './date-time-duration.js'
import Duration from './duration.js'
import Link from './link.js'

/** @typedef {NonNullable<import('../schema.d.ts').ResumeSchema['work']>[number]} Work */
/** @typedef {Pick<Work, 'highlights' | 'location' | 'position' | 'startDate' | 'endDate' | 'summary'>} NestedWorkItem */
/** @typedef {Pick<Work, 'description' | 'image' | 'name' | 'url'> & { items: NestedWorkItem[] }} NestedWork */

/**
 * @param {import('../schema.d.ts').ResumeSchema['work']} work
 * @returns {string | false}
 */
export default function Work(work = [], label = 'Work') {
  if (!work.length) return ''

  const nestedWork = work.reduce((acc, { description, image, name, url, ...rest }) => {
    const prev = acc[acc.length - 1]
    if (prev && prev.name === name && prev.description === description && prev.url === url) {
      if (!prev.image && image) prev.image = image
      prev.items.push(rest)
    } else acc.push({ description, image, name, url, items: [rest] })
    return acc
  }, /** @type {NestedWork[]} */ ([]))

  return html`
    <section id="work">
      <h3>${label}</h3>
      <div class="stack">
        ${nestedWork.map(({ description, image, name, url, items = [] }) => {
          const singleItem = items.length === 1 ? items[0] : undefined
          return html`
            <article>
              <header>
                <div class="entry-header">
                  ${image &&
                  html`
                    <div class="entry-logo-frame">
                      ${url
                        ? html`
                            <a href="${url}" aria-label="${name}" class="entry-logo-link">
                              <img class="entry-logo" src="${image}" alt="" loading="lazy" />
                            </a>
                          `
                        : html`<img class="entry-logo" src="${image}" alt="" loading="lazy" />`}
                    </div>
                  `}
                  <div class="entry-header-body">
                    <h4>
                      ${singleItem
                        ? singleItem.position && markdownInline(singleItem.position)
                        : Link(url, name, { markdown: true })}
                    </h4>
                    <div class="meta">
                      ${singleItem
                        ? html`
                            <div>
                              ${[html`<strong>${Link(url, name, { markdown: true })}</strong>`, description]
                                .filter(Boolean)
                                .join(' · ')}
                            </div>
                            ${singleItem.startDate &&
                            html`<div>${DateTimeDuration(singleItem.startDate, singleItem.endDate)}</div>`}
                            ${singleItem.location && html`<div>${singleItem.location}</div>`}
                          `
                        : html`
                            ${description && html`<div>${description}</div>`}
                            ${items.some(item => item.startDate) && html`<div>${Duration(items)}</div>`}
                          `}
                    </div>
                  </div>
                </div>
              </header>
              <div class="timeline">
                ${items.map(
                  ({ highlights = [], location, position, startDate, endDate, summary }) => html`
                    <div>
                      ${!singleItem &&
                      html`
                        <div>
                          <h5>${position && markdownInline(position)}</h5>
                          <div class="meta">
                            ${startDate && html`<div>${DateTimeDuration(startDate, endDate)}</div>`}
                            ${location && html`<div>${location}</div>`}
                          </div>
                        </div>
                      `}
                      ${summary && markdown(summary)}
                      ${highlights.length > 0 &&
                      html`
                        <ul>
                          ${highlights.map(highlight => html`<li>${markdown(highlight)}</li>`)}
                        </ul>
                      `}
                    </div>
                  `,
                )}
              </div>
            </article>
          `
        })}
      </div>
    </section>
  `
}
