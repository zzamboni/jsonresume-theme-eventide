import { html } from '@rbardini/html'

const normalizeLinks = input => {
  if (!input) return []

  if (Array.isArray(input)) {
    return input.flatMap(item => {
      if (item && typeof item === 'object' && 'label' in item && 'url' in item) {
        return [{ label: String(item.label), url: String(item.url) }]
      }
      if (Array.isArray(item) && item.length === 2) {
        return [{ label: String(item[0]), url: String(item[1]) }]
      }
      return []
    })
  }

  if (typeof input === 'object') {
    return Object.entries(input).map(([label, url]) => ({ label: String(label), url: String(url) }))
  }

  return []
}

/**
 * @param {import('../schema.d.ts').ResumeSchema['meta']} meta
 * @returns {string | false}
 */
export default function VersionsBar(meta = {}) {
  const themeOptions = meta?.themeOptions || {}
  const versions = normalizeLinks(themeOptions.versions)
  const downloads = normalizeLinks(themeOptions.downloads)

  if (!versions.length && !downloads.length) return false

  return html`
    <nav class="versions-bar" aria-label="CV versions and downloads">
      ${(versions.length > 0 &&
        html`
          <div class="versions-bar__group">
            <span class="versions-bar__label">Versions</span>
            <ul class="versions-bar__list">
              ${versions.map(item => html`<li><a href="${item.url}">${item.label}</a></li>`)}
            </ul>
          </div>
        `) ||
      ''}
      ${(downloads.length > 0 &&
        html`
          <div class="versions-bar__group">
            <span class="versions-bar__label">Downloads</span>
            <ul class="versions-bar__list">
              ${downloads.map(item => html`<li><a href="${item.url}">${item.label}</a></li>`)}
            </ul>
          </div>
        `) ||
      ''}
    </nav>
  `
}
