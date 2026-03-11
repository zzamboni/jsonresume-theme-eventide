import { findIconDefinition, icon, library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import feather from 'feather-icons'

library.add(fas, far, fab)

/** @typedef {import('feather-icons').FeatherIconNames} FeatherIconNames */

/**
 * @param {string} name
 * @param {string} [fallback]
 * @param {'feather' | 'fontawesome'} [iconSet]
 * @returns {string | undefined}
 */
export default function Icon(name, fallback, iconSet = 'feather') {
  const key = name?.toLowerCase?.()

  /**
   * Accept either a plain Font Awesome name (`file-pdf`) or the same class-like
   * strings shown on the Font Awesome site (`fa-regular fa-file-pdf`).
   */
  const parseFontAwesomeSpec = spec => {
    const tokens = spec?.split?.(/\s+/)?.filter(Boolean) || []
    let preferredPrefixes = []
    let iconName = ''

    for (const token of tokens) {
      if (token === 'fa-solid') {
        preferredPrefixes = ['fas']
      } else if (token === 'fa-regular') {
        preferredPrefixes = ['far']
      } else if (token === 'fa-brands') {
        preferredPrefixes = ['fab']
      } else if (token.startsWith('fa-') && token !== 'fa-fw') {
        iconName = token.slice(3)
      } else if (token !== 'fa') {
        iconName = token
      }
    }

    if (!preferredPrefixes.length) preferredPrefixes = ['fas', 'far', 'fab']
    return { preferredPrefixes, iconName }
  }

  if (iconSet === 'fontawesome') {
    const { preferredPrefixes, iconName } = parseFontAwesomeSpec(key)
    const faIconDef = preferredPrefixes
      .map(prefix => findIconDefinition({ prefix, iconName: /** @type {any} */ (iconName) }))
      .find(Boolean)
    if (faIconDef) {
      const faIcon = icon(faIconDef, {
        classes: ['icon-fa', 'fa-fw'],
        attributes: { width: 16, height: 16 },
      })
      return faIcon.html[0]
    }
  }

  const featherIcon =
    (key && feather.icons[/** @type {FeatherIconNames} */ (key)]) ||
    (fallback && feather.icons[/** @type {FeatherIconNames} */ (fallback.toLowerCase())])
  return featherIcon?.toSvg({ width: 16, height: 16 })
}
