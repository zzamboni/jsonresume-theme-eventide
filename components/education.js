import { html } from '@rbardini/html'
import markdown, { markdownInline } from '../utils/markdown.js'
import DateTimeDuration from './date-time-duration.js'
import Link from './link.js'

/**
 * @param {import('../schema.d.ts').ResumeSchema['education']} education
 * @returns {string | false}
 */
export default function Education(education = [], label = 'Education') {
  if (!education.length) return ''

  return html`
    <section id="education">
      <h3>${label}</h3>
      <div class="stack">
        ${education.map(
          ({ area, courses = [], image, institution, startDate, endDate, studyType, url }) => html`
            <article>
              <header>
                <div class="entry-header">
                  ${image &&
                  html`
                    <div class="entry-logo-frame">
                      ${url
                        ? html`
                            <a href="${url}" aria-label="${institution}" class="entry-logo-link">
                              <img class="entry-logo" src="${image}" alt="" loading="lazy" />
                            </a>
                          `
                        : html`<img class="entry-logo" src="${image}" alt="" loading="lazy" />`}
                    </div>
                  `}
                  <div class="entry-header-body">
                    <h4>${Link(url, institution, { markdown: true })}</h4>
                    <div class="meta">
                      <div>
                        ${[
                          studyType && markdownInline(studyType),
                          area && html`<strong>${markdownInline(area)}</strong>`,
                        ]
                          .filter(Boolean)
                          .join(' in ')}
                      </div>
                      ${startDate && html`<div>${DateTimeDuration(startDate, endDate)}</div>`}
                    </div>
                  </div>
                </div>
              </header>
              ${courses.length > 0 &&
              html`
                <h5>Courses</h5>
                <ul>
                  ${courses.map(course => html`<li>${markdown(course)}</li>`)}
                </ul>
              `}
            </article>
          `,
        )}
      </div>
    </section>
  `
}
