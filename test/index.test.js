import { HtmlValidate } from 'html-validate'
import { expect, it } from 'vitest'

import sampleResume from '@jsonresume/schema/sample.resume.json' with { type: 'json' }
import { render } from '../index.js'

const meta = {
  ...sampleResume.meta,
  themeOptions: {
    colors: {
      background: ['lightgray', 'darkgray'],
    },
  },
}

const resume = {
  ...sampleResume,
  meta,
  basics: {
    ...sampleResume.basics,
    image: 'image.jpg',
  },
}

it('renders a resume', () => {
  expect(render(resume)).toMatchSnapshot()
})

it('renders a resume with additional section metadata', () => {
  const resumeWithSections = {
    ...resume,
    meta: {
      ...meta,
      themeOptions: {
        ...meta.themeOptions,
        projectsByType: true,
        sectionLabels: { work: 'Jobs', 'projects:application': 'Apps' },
        sections: [
          'work',
          'projects:application',
          'volunteer',
          'education',
          'skills',
          'awards',
          'certificates',
          'publications',
          'languages',
          'interests',
          'references',
        ],
      },
    },
  }

  expect(render(resumeWithSections)).toMatchSnapshot()
})

it('does not render a table of contents when explicitly disabled', () => {
  const resumeWithoutToc = {
    ...resume,
    meta: {
      ...meta,
      themeOptions: {
        ...meta.themeOptions,
        showTableOfContents: false,
      },
    },
  }

  expect(render(resumeWithoutToc)).not.toContain('class="table-of-contents"')
  expect(render(resumeWithoutToc)).not.toContain('class="table-of-contents-toggle"')
})

it('renders logos for work and education entries when image is provided', () => {
  const resumeWithEntryLogos = {
    ...resume,
    work: [
      {
        ...resume.work[0],
        image: 'https://example.com/work-logo.png',
      },
    ],
    education: [
      {
        ...resume.education[0],
        image: 'https://example.com/education-logo.png',
      },
    ],
  }

  const output = render(resumeWithEntryLogos)

  expect(output).toContain('src="https://example.com/work-logo.png"')
  expect(output).toContain('src="https://example.com/education-logo.png"')
  expect(output).toContain('class="entry-logo"')
})

it('groups work entries when only some entries provide an image', () => {
  const resumeWithMixedWorkImages = {
    ...resume,
    work: [
      {
        ...resume.work[0],
        image: 'https://example.com/work-logo.png',
      },
      {
        ...resume.work[0],
        position: 'CTO',
        summary: 'Follow-up role',
      },
    ],
  }

  const output = render(resumeWithMixedWorkImages)

  expect(output.match(/<section id="work">[\s\S]*?<article>/g)).toHaveLength(1)
  expect(output).toContain('src="https://example.com/work-logo.png"')
  expect(output).toContain('CEO/President')
  expect(output).toContain('CTO')
})

it('renders configurable footer content', () => {
  const resumeWithCustomFooter = {
    ...resume,
    meta: {
      ...meta,
      themeOptions: {
        ...meta.themeOptions,
        footer_left: 'Custom left footer',
        footer_right: 'Built with [Resume Toolkit](https://example.com)',
      },
    },
  }

  const output = render(resumeWithCustomFooter)

  expect(output).toContain('Custom left footer')
  expect(output).toContain('Built with <a href="https://example.com">Resume Toolkit</a>')
  expect(output).toContain('class="resume-footer"')
})

it('renders valid HTML', async () => {
  const htmlvalidate = new HtmlValidate({
    extends: ['html-validate:recommended', 'html-validate:prettier'],
    rules: {
      'no-inline-style': 'off',
      'no-trailing-whitespace': 'off',
      'tel-non-breaking': 'off',
    },
  })

  const {
    results: [{ messages } = {}],
  } = await htmlvalidate.validateString(render(resume))

  expect(messages).toBeUndefined()
})
