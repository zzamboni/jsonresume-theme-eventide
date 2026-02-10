import { html } from '@rbardini/html'
import Awards from './awards.js'
import Certificates from './certificates.js'
import Education from './education.js'
import Interests from './interests.js'
import Languages from './languages.js'
import Projects from './projects.js'
import Publications from './publications.js'
import References from './references.js'
import Skills from './skills.js'
import Volunteer from './volunteer.js'
import Work from './work.js'

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

const sectionComponentMap = {
  work: (resume, label) => Work(resume.work, label),
  volunteer: (resume, label) => Volunteer(resume.volunteer, label),
  education: (resume, label) => Education(resume.education, label),
  projects: (resume, label, options) => Projects(resume.projects, label, options),
  awards: (resume, label) => Awards(resume.awards, label),
  certificates: (resume, label) => Certificates(resume.certificates, label),
  publications: (resume, label) => Publications(resume.publications, label),
  skills: (resume, label) => Skills(resume.skills, label),
  languages: (resume, label) => Languages(resume.languages, label),
  interests: (resume, label) => Interests(resume.interests, label),
  references: (resume, label) => References(resume.references, label),
}

const normalizeLabel = label => (label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : label)

const slugify = type =>
  type
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'projects'

const isProjectSection = sectionId => sectionId === 'projects' || sectionId.startsWith(projectSectionPrefix)

/**
 * @param {import('../schema.d.ts').ResumeSchema} resume
 * @param {{ groupByType?: boolean }} [options]
 * @returns {string}
 */
export default function Sections(resume, { groupByType = false } = {}) {
  const themeOptions = resume.meta?.themeOptions || {}
  const sections = themeOptions.sections || defaultSections
  const sectionLabels = themeOptions.sectionLabels || {}
  const projectEntries = sections.filter(isProjectSection)
  const hasProjectOverrides = Array.isArray(themeOptions.sections) && projectEntries.length > 0
  const projects = resume.projects || []

  return html`${sections.map(section => {
    if (groupByType && hasProjectOverrides && isProjectSection(section)) {
      if (projects.length === 0) return null

      const typeKey = section === 'projects' ? null : section.slice(projectSectionPrefix.length).trim()
      if (!typeKey) {
        const typeless = projects.filter(project => !project.type)
        if (typeless.length === 0) return null
        const label = normalizeLabel(sectionLabels.projects || 'Projects')
        return Projects(typeless, label, { groupByType: true, sectionId: 'projects' })
      }

      const typed = projects.filter(project => project.type === typeKey)
      if (typed.length === 0) return null
      const label = normalizeLabel(sectionLabels[section] || typeKey)
      const sectionId = `projects-${slugify(typeKey)}`
      return Projects(typed, label, { groupByType: true, sectionId, typeLabelOverrides: { [typeKey]: label } })
    }

    const label = normalizeLabel(sectionLabels[section] || section)
    const renderer = sectionComponentMap[section]
    return renderer ? renderer(resume, label, { groupByType }) : null
  })}`
}
