import { html } from '@rbardini/html'
import { markdownInline } from '../utils/markdown.js'

/**
 * @param {string} url
 * @returns {string}
 */
const formatURL = url => url.replace(/^(https?:|)\/\//, '').replace(/\/$/, '')

/**
 * @param {string} [url]
 * @param {string} [name]
 * @param {{ markdown?: boolean }} [options]
 * @returns {string | undefined}
 */
export default function Link(url, name, { markdown = false } = {}) {
  const renderedName = name && (markdown ? markdownInline(name) : name)
  return renderedName
    ? url
      ? html`<a href="${url}">${renderedName}</a>`
      : renderedName
    : url && html`<a href="${url}">${formatURL(url)}</a>`
}
