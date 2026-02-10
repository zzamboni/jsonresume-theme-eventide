import { html } from '@rbardini/html'
import markdown, { markdownInline } from '../utils/markdown.js'
import DateTimeDuration from './date-time-duration.js'
import Link from './link.js'

/**
 * @param {string[]} roles
 * @returns {string}
 */
const formatRoles = roles => (Intl.ListFormat ? new Intl.ListFormat('en').format(roles) : roles.join(', '))

/**
 * @param {import('../schema.d.ts').ResumeSchema['projects']} projects
 * @param {{ groupByType?: boolean }} [options]
 * @returns {string | false}
 */
export default function Projects(projects = [], labelOrOptions, options = {}) {
  let label = 'Projects'
  let groupByType = false
  let sectionId = 'projects'
  let typeLabelOverrides = undefined

  if (labelOrOptions && typeof labelOrOptions === 'object') {
    groupByType = Boolean(labelOrOptions.groupByType)
    if (typeof labelOrOptions.label === 'string') label = labelOrOptions.label
    if (typeof labelOrOptions.sectionId === 'string') sectionId = labelOrOptions.sectionId
    if (labelOrOptions.typeLabelOverrides) typeLabelOverrides = labelOrOptions.typeLabelOverrides
  } else {
    if (typeof labelOrOptions === 'string') label = labelOrOptions
    groupByType = Boolean(options.groupByType)
    if (typeof options.label === 'string') label = options.label
    if (typeof options.sectionId === 'string') sectionId = options.sectionId
    if (options.typeLabelOverrides) typeLabelOverrides = options.typeLabelOverrides
  }

  if (projects.length === 0) return ''

  const renderProjects = list => html`
    <div class="stack">
      ${list.map(
        ({
          description,
          entity,
          highlights = [],
          keywords = [],
          name,
          startDate,
          endDate,
          roles = [],
          type,
          url,
        }) => html`
          <article>
            <header>
              <h4>${Link(url, name, { markdown: true })}</h4>
              <div class="meta">
                <div>
                  ${roles.length > 0 && html`<strong>${formatRoles(roles)}</strong>`}
                  ${roles.length > 0 && entity && html`at `}
                  ${entity && html`<strong>${markdownInline(entity)}</strong>`}
                </div>
                ${startDate && html`<div>${DateTimeDuration(startDate, endDate)}</div>`}
                ${type && !groupByType && html`<div>${type}</div>`}
              </div>
            </header>
            ${description && markdown(description)}
            ${highlights.length > 0 &&
            html`
              <ul>
                ${highlights.map(highlight => html`<li>${markdown(highlight)}</li>`)}
              </ul>
            `}
            ${keywords.length > 0 &&
            html`
              <ul class="tag-list">
                ${keywords.map(keyword => html`<li>${keyword}</li>`)}
              </ul>
            `}
          </article>
        `,
      )}
    </div>
  `

  if (!groupByType) {
    return html`
      <section id="${sectionId}">
        <h3>${label}</h3>
        ${renderProjects(projects)}
      </section>
    `
  }

  const groups = projects.reduce((acc, project) => {
    const type = project.type?.trim() || '__default__'
    acc[type] = acc[type] || []
    acc[type].push(project)
    return acc
  }, /** @type {Record<string, NonNullable<import('../schema.d.ts').ResumeSchema['projects']>[number][]>} */ ({}))

  const slugify = type =>
    type
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'projects'

  return html`
    ${Object.entries(groups).map(([type, items]) => {
      const isDefaultGroup = type === '__default__'
      const sectionLabel = isDefaultGroup ? label : typeLabelOverrides?.[type] || type
      const slug = slugify(type)
      const sectionId = isDefaultGroup ? 'projects' : slug === 'projects' ? 'projects' : `projects-${slug}`
      return html`
        <section id="${sectionId}">
          <h3>${sectionLabel}</h3>
          ${renderProjects(items)}
        </section>
      `
    })}
  `
}
