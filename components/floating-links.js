import { html } from '@rbardini/html'
import Icon from './icon.js'

const normalizeLinks = input => {
  if (!input) return []

  if (Array.isArray(input)) {
    return input.flatMap(item => {
      if (item && typeof item === 'object' && 'name' in item && 'url' in item) {
        return [
          {
            name: String(item.name),
            url: String(item.url),
            icon: item.icon ? String(item.icon) : undefined,
          },
        ]
      }
      return []
    })
  }

  return []
}

/**
 * @param {import('../schema.d.ts').ResumeSchema['meta']} meta
 * @returns {string}
 */
export default function FloatingLinks(meta = {}) {
  const themeOptions = meta?.themeOptions || {}
  const links = normalizeLinks(themeOptions.links)

  if (!links.length) return ''

  return html`
    <nav class="floating-links" aria-label="Quick links">
      ${links.map(
        ({ icon, name, url }) => html`
          <a href="${url}" aria-label="${name}" title="${name}">
            ${Icon(icon || name, undefined, 'fontawesome') || name}
          </a>
        `,
      )}
    </nav>
  `
}
