import { html } from '@rbardini/html'
import { markdownInline } from '../utils/markdown.js'

/**
 * @typedef {import('../schema.d.ts').ResumeSchema} Resume
 * @typedef {{footer_left?: string, footer_right?: string}} ThemeOptions
 */

/**
 * @param {Resume} resume
 * @returns {string}
 */
export default function Footer(resume) {
  /** @type {ThemeOptions} */
  const themeOptions = resume.meta?.themeOptions || {}
  const currentYear = new Date().getFullYear()
  const defaultLeft = ['©', resume.basics?.name, currentYear].filter(Boolean).join(' ')
  const footerLeft = themeOptions.footer_left || defaultLeft
  const footerRight =
    themeOptions.footer_right || 'Powered by [Eventide](https://github.com/zzamboni/jsonresume-theme-eventide)'

  return html`
    <footer class="resume-footer">
      <div class="resume-footer-content">
        <p class="resume-footer-left">${markdownInline(footerLeft)}</p>
        <p class="resume-footer-right">${markdownInline(footerRight)}</p>
      </div>
    </footer>
  `
}
