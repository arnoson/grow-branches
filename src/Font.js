import aglfn from 'aglfn'
import { GlyphDefinition } from './GlyphDefinition'
import { loadSVG } from './utils'

/**
 * @typedef {Object} FontInfo
 * @property {Map} glyphDefinitions - The glyph definitions.
 */

export class Font {
  constructor() {
    this.url = null
    this.item = null
    this.glyphDefinitions = new Map()
  }

  /**
   * Load and parse a svg file.
   * @param {string} url – The url of the font's svg file.
   */
  // TODO accept item directly.
  async load(url) {
    this.item = await loadSVG(url, { insert: false })
    const { glyphDefinitions } = this.parse(this.item)
    this.glyphDefinitions = glyphDefinitions
  }

  /**
   * Parse the item.
   * @param {paper.Group} item - The item to parse.
   * @returns {FontInfo}
   */
  parse(item) {
    const glyphDefinitions = new Map()

    const children = item.children
    for (const child of children) {
      const { name } = child
      if (name) {
        const { unicodeValue } = aglfn.find(el => el.glyphName === name) || {}
        if (unicodeValue) {
          const charCode = parseInt(`0x${unicodeValue}`)
          glyphDefinitions.set(charCode, new GlyphDefinition(child))
        }
      }
    }

    return { glyphDefinitions }
  }
}
