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

  const sectionsOrder = resume.meta?.sections || defaultSections
  const sectionLabels = resume.meta?.sectionLabels || {}
  const labelForSection = sectionId => normalizeLabel(sectionLabels[sectionId] || sectionId)

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

  // Build list of sections that have content, honoring custom order/labels
  const sections = sectionsOrder.flatMap(sectionId => {
    if (sectionId === 'projects') {
      if (!hasContent.projects) return []
      if (!groupByType) return [section('projects', labelForSection('projects'), true)]

      const types = [...new Set(projects.map(p => p.type).filter(Boolean))]
      const hasTypeless = projects.some(p => !p.type)

      return [
        ...types.map(type => {
          const slug = slugify(type)
          return { id: slug === 'projects' ? 'projects' : `projects-${slug}`, label: type }
        }),
        ...(hasTypeless ? [{ id: 'projects', label: labelForSection('projects') }] : []),
      ]
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
