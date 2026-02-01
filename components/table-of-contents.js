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

  // Build list of sections that have content
  const sections = [
    section('work', 'Work', work && work.length > 0),
    section('volunteer', 'Volunteer', volunteer && volunteer.length > 0),
    section('education', 'Education', education && education.length > 0),
    // Handle projects sections - either grouped by type or single section
    ...(projects && projects.length > 0
      ? groupByType
        ? (() => {
            const types = [...new Set(projects.map(p => p.type).filter(Boolean))]
            const hasTypeless = projects.some(p => !p.type)
            return [
              ...types.map(type => {
                const slug = slugify(type)
                return { id: slug === 'projects' ? 'projects' : `projects-${slug}`, label: type }
              }),
              ...(hasTypeless ? [{ id: 'projects', label: 'Projects' }] : []),
            ]
          })()
        : [{ id: 'projects', label: 'Projects' }]
      : []),
    section('awards', 'Awards', awards && awards.length > 0),
    section('certificates', 'Certificates', certificates && certificates.length > 0),
    section('publications', 'Publications', publications && publications.length > 0),
    section('skills', 'Skills', skills && skills.length > 0),
    section('languages', 'Languages', languages && languages.length > 0),
    section('interests', 'Interests', interests && interests.length > 0),
    section('references', 'References', references && references.length > 0),
  ].filter(Boolean)

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
