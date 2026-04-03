import sampleResume from '@jsonresume/schema/sample.resume.json' with { type: 'json' }

const resume = {
  $schema: sampleResume.$schema,
  basics: {
    ...sampleResume.basics,
    image: 'https://i.pravatar.cc/300?img=12',
  },
  work: [
    {
      ...sampleResume.work[0],
      image: 'https://placehold.co/300/ffffff/0073aa?text=PP',
    },
    {
      ...sampleResume.work[0],
      position: 'Chief Architect',
      startDate: '2012-06-01',
      endDate: '2013-11-01',
      summary: 'Helped shape the early architecture, developer workflows and product direction for Pied Piper.',
      highlights: [
        'Defined the first platform architecture for the compression engine.',
        'Created the original review process for algorithm changes and performance experiments.',
      ],
    },
  ],
  volunteer: sampleResume.volunteer,
  education: [
    {
      ...sampleResume.education[0],
      image: 'https://placehold.co/300/darkred/white?text=OU',
    },
  ],
  awards: sampleResume.awards,
  certificates: [
    {
      name: 'See full credential list on Credly',
      url: 'https://www.credly.com/',
    },
    {
      name: 'Certified Information Systems Security Professional (CISSP)',
      issuer: 'ISC2',
      date: '2019-04-01',
      url: 'https://www.isc2.org/certifications/cissp',
      image: 'https://images.credly.com/images/6eeb0a98-33cb-4f72-bfc3-f89d65a3286c/image.png',
    },
  ],
  publications: [
    {
      name: 'Selected talks and writing archive',
      url: 'https://example.com/publications',
    },
    ...sampleResume.publications,
  ],
  skills: sampleResume.skills,
  languages: sampleResume.languages,
  interests: sampleResume.interests,
  references: sampleResume.references,
  projects: [
    ...sampleResume.projects,
    {
      name: 'Middle-out Compression Toolkit',
      description: 'Reference implementation and testing helpers for the Pied Piper compression pipeline.',
      highlights: [
        'Packaged benchmarking fixtures for repeatable algorithm experiments.',
        'Documented integration patterns for application teams.',
      ],
      keywords: ['Node.js', 'Benchmarking', 'Compression'],
      startDate: '2015-01-15',
      endDate: '2016-02-01',
      url: 'https://example.com/middle-out-toolkit',
      roles: ['Maintainer'],
      entity: 'Pied Piper',
      type: 'library',
    },
    {
      description: 'Additional selected projects and demos are available online.',
      type: 'application',
    },
  ],
  meta: {
    ...sampleResume.meta,
    themeOptions: {
      colors: {
        background: ['#ffffff', '#191e23'],
        dimmed: ['#f3f4f5', '#23282d'],
        primary: ['#191e23', '#fbfbfc'],
        secondary: ['#6c7781', '#ccd0d4'],
        accent: ['#0073aa', '#00a0d2'],
      },
      icons: 'fontawesome',
      projectsByType: true,
      showTableOfContents: true,
      sections: [
        'work',
        'volunteer',
        'education',
        'projects:application',
        'projects:library',
        'awards',
        'certificates',
        'publications',
        'skills',
        'languages',
        'interests',
        'references',
      ],
      sectionLabels: {
        work: 'Experience',
        'projects:application': 'Featured Projects',
        'projects:library': 'Open Source',
      },
      links: [
        {
          name: 'Portfolio',
          url: 'https://example.com/richard-hendriks',
          icon: 'globe',
        },
        {
          name: 'PDF',
          url: 'https://example.com/richard-hendriks.pdf',
          icon: 'file-pdf',
        },
        {
          name: 'GitHub',
          url: 'https://github.com/piedpiper',
          icon: 'github',
        },
      ],
      footer_left: '© Richard Hendriks 2026',
      footer_right: 'Powered by [Eventide](https://github.com/zzamboni/jsonresume-theme-eventide)',
    },
  },
}

export default resume
