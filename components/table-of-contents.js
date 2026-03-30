import { html } from '@rbardini/html'

/**
 * @typedef {import('../schema.d.ts').ResumeSchema} Resume
 * @typedef {NonNullable<Resume['projects']>[number]} Project
 * @typedef {{sections?: string[], sectionLabels?: Record<string, string>}} ThemeOptions
 * @typedef {{groupByType?: boolean}} TableOfContentsOptions
 */

/**
 * Slugifies a string for use in IDs
 * @param {string} str
 * @returns {string}
 */
const slugify = str =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || str

/**
 * Generates section info for table of contents
 * @param {string} id - Section ID
 * @param {string} label - Section display label
 * @param {boolean} hasContent - Whether section has content
 * @returns {{ id: string, label: string } | null}
 */
const section = (id, label, hasContent) => (hasContent ? { id, label } : null)

const projectSectionPrefix = 'projects:'

const defaultSections = [
  'work',
  'volunteer',
  'education',
  'projects',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
]

/** @param {string} label */
const normalizeLabel = label => (label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : label)

/** @param {string} sectionId */
const isProjectSection = sectionId => sectionId === 'projects' || sectionId.startsWith(projectSectionPrefix)

/**
 * @param {Resume} resume
 * @param {TableOfContentsOptions} [options]
 * @returns {string | false}
 */
export default function TableOfContents(resume, { groupByType = false } = {}) {
  const {
    basics,
    work,
    volunteer,
    education,
    projects,
    awards,
    certificates,
    publications,
    skills,
    languages,
    interests,
    references,
  } = resume
  /** @type {Project[]} */
  const projectList = projects || []

  /** @type {ThemeOptions} */
  const themeOptions = resume.meta?.themeOptions || {}
  const sectionsOrder = themeOptions.sections || defaultSections
  const sectionLabels = themeOptions.sectionLabels || {}
  /** @param {string} sectionId */
  const labelForSection = sectionId => normalizeLabel(sectionLabels[sectionId] || sectionId)
  const projectEntries = sectionsOrder.filter(isProjectSection)
  const hasProjectOverrides = Array.isArray(themeOptions.sections) && projectEntries.length > 0

  /** @type {Record<string, boolean>} */
  const hasContent = {
    work: Boolean(work && work.length > 0),
    volunteer: Boolean(volunteer && volunteer.length > 0),
    education: Boolean(education && education.length > 0),
    projects: projectList.length > 0,
    awards: Boolean(awards && awards.length > 0),
    certificates: Boolean(certificates && certificates.length > 0),
    publications: Boolean(publications && publications.length > 0),
    skills: Boolean(skills && skills.length > 0),
    languages: Boolean(languages && languages.length > 0),
    interests: Boolean(interests && interests.length > 0),
    references: Boolean(references && references.length > 0),
  }

  /**
   * @param {string} typeKey
   * @param {string} label
   * @returns {{ id: string, label: string }}
   */
  const buildProjectSection = (typeKey, label) => {
    const slug = slugify(typeKey)
    return { id: slug === 'projects' ? 'projects' : `projects-${slug}`, label }
  }

  // Build list of sections that have content, honoring custom order/labels
  const sections = sectionsOrder.flatMap(sectionId => {
    if (sectionId === 'projects') {
      if (!hasContent.projects) return []

      if (groupByType && hasProjectOverrides) {
        const hasTypeless = projectList.some(project => !project.type)
        return hasTypeless ? [section('projects', labelForSection('projects'), true)] : []
      }

      if (!groupByType) return [section('projects', labelForSection('projects'), true)]

      const types = /** @type {string[]} */ ([...new Set(projectList.map(p => p.type).filter(Boolean))])
      const hasTypeless = projectList.some(p => !p.type)

      return [
        ...types.map(type => buildProjectSection(type, type)),
        ...(hasTypeless ? [{ id: 'projects', label: labelForSection('projects') }] : []),
      ]
    }

    if (groupByType && hasProjectOverrides && isProjectSection(sectionId)) {
      if (!hasContent.projects) return []
      const typeKey = sectionId.slice(projectSectionPrefix.length).trim()
      if (!typeKey) return []

      const hasType = projectList.some(project => project.type === typeKey)
      if (!hasType) return []

      const label = normalizeLabel(sectionLabels[sectionId] || typeKey)
      return [buildProjectSection(typeKey, label)]
    }

    if (!(sectionId in hasContent)) return []
    return [section(sectionId, labelForSection(sectionId), hasContent[sectionId])].filter(Boolean)
  })
  /** @type {{ id: string, label: string }[]} */
  const visibleSections = sections.filter(
    /** @returns {section is { id: string, label: string }} */
    section => Boolean(section),
  )

  if (!visibleSections.length) return ''

  return html`
    <button
      class="table-of-contents-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="table-of-contents"
      aria-label="Open table of contents"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="table-of-contents" id="table-of-contents" aria-label="Table of contents">
      <ul>
        <li>
          <a href="#top" data-toc-target="top"><b>${basics?.name || ''}</b></a>
        </li>
        ${visibleSections.map(({ id, label }) => html`<li><a href="#${id}" data-toc-target="${id}">${label}</a></li>`)}
      </ul>
    </nav>
  `
}
