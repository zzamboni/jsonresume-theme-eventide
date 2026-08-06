import * as micromarkModule from 'micromark'
import striptags from 'striptags'

/** @typedef {{ micromark?: (value: string) => string, default?: (value: string) => string }} MicromarkCompat */

const micromarkCompat = /** @type {MicromarkCompat} */ (/** @type {unknown} */ (micromarkModule))
const resolvedMicromark = micromarkCompat.micromark || micromarkCompat.default

if (!resolvedMicromark) {
  throw new Error('Unable to resolve micromark export')
}

/** @type {(value: string) => string} */
const micromark = resolvedMicromark

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
