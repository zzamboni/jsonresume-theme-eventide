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
