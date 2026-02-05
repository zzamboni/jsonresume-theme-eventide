import micromark from 'micromark'
import striptags from 'striptags'

/**
 * @param {string} doc
 * @param {boolean} [stripTags]
 * @returns
 */
export default function markdown(doc, stripTags = false) {
  // @ts-expect-error missing micromark types
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
