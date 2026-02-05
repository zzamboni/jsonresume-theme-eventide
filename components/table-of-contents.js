import { html } from '@rbardini/html'

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

const normalizeLabel = label => (label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : label)

const isProjectSection = sectionId => sectionId === 'projects' || sectionId.startsWith(projectSectionPrefix)

/**
 * @param {import('../schema.d.ts').ResumeSchema} resume
 * @param {{ groupByType?: boolean }} [options]
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

  const themeOptions = resume.meta?.themeOptions || {}
  const sectionsOrder = themeOptions.sections || defaultSections
  const sectionLabels = themeOptions.sectionLabels || {}
  const labelForSection = sectionId => normalizeLabel(sectionLabels[sectionId] || sectionId)
  const projectEntries = sectionsOrder.filter(isProjectSection)
  const hasProjectOverrides = Array.isArray(themeOptions.sections) && projectEntries.length > 0

  const hasContent = {
    work: work && work.length > 0,
    volunteer: volunteer && volunteer.length > 0,
    education: education && education.length > 0,
    projects: projects && projects.length > 0,
    awards: awards && awards.length > 0,
    certificates: certificates && certificates.length > 0,
    publications: publications && publications.length > 0,
    skills: skills && skills.length > 0,
    languages: languages && languages.length > 0,
    interests: interests && interests.length > 0,
    references: references && references.length > 0,
  }

  const buildProjectSection = (typeKey, label) => {
    const slug = slugify(typeKey)
    return { id: slug === 'projects' ? 'projects' : `projects-${slug}`, label }
  }

  // Build list of sections that have content, honoring custom order/labels
  const sections = sectionsOrder.flatMap(sectionId => {
    if (sectionId === 'projects') {
      if (!hasContent.projects) return []

      if (groupByType && hasProjectOverrides) {
        const hasTypeless = projects.some(project => !project.type)
        return hasTypeless ? [section('projects', labelForSection('projects'), true)] : []
      }

      if (!groupByType) return [section('projects', labelForSection('projects'), true)]

      const types = [...new Set(projects.map(p => p.type).filter(Boolean))]
      const hasTypeless = projects.some(p => !p.type)

      return [
        ...types.map(type => buildProjectSection(type, type)),
        ...(hasTypeless ? [{ id: 'projects', label: labelForSection('projects') }] : []),
      ]
    }

    if (groupByType && hasProjectOverrides && isProjectSection(sectionId)) {
      if (!hasContent.projects) return []
      const typeKey = sectionId.slice(projectSectionPrefix.length).trim()
      if (!typeKey) return []

      const hasType = projects.some(project => project.type === typeKey)
      if (!hasType) return []

      const label = normalizeLabel(sectionLabels[sectionId] || typeKey)
      return [buildProjectSection(typeKey, label)]
    }

    if (!(sectionId in hasContent)) return []
    return [section(sectionId, labelForSection(sectionId), hasContent[sectionId])].filter(Boolean)
  })

  return (
    sections.length > 0 &&
    html`
      <nav class="table-of-contents" aria-label="Table of contents">
        <ul>
          <li>
            <a href="#top" data-toc-target="top"><b>${basics.name}</b></a>
          </li>
          ${sections.map(({ id, label }) => html`<li><a href="#${id}" data-toc-target="${id}">${label}</a></li>`)}
        </ul>
      </nav>
    `
  )
}
