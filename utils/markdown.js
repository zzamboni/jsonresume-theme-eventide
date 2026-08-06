import * as micromarkModule from 'micromark'
import striptags from 'striptags'

/** @type {(value: string) => string} */
const micromark =
  'micromark' in micromarkModule
    ? /** @type {(value: string) => string} */ (/** @type {unknown} */ (micromarkModule.micromark))
    : /** @type {(value: string) => string} */ (/** @type {unknown} */ (micromarkModule.default))

/**
 * @param {string} doc
 * @param {boolean} [stripTags]
 * @returns
 */
export default function markdown(doc, stripTags = false) {
  const html = /** @type {string} */ (micromark(doc))
  return stripTags ? striptags(html) : html
}

/**
 * @param {string} doc
 * @returns {string}
 */
export function markdownInline(doc) {
  return markdown(doc).replace(/^<p>|<\/p>$/g, '')
}
