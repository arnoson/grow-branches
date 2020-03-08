import aglfn from 'aglfn'
import { Glyph } from './Glyph'
import { loadSVG } from './utils'

/**
 * @typedef {Object} FontInfo
 * @property {Map} glyphs - The glyphs.
 */

export class Font {
  constructor() {
    this.url = null
    this.item = null
    this.glyphs = new Map()
  }

  /**
   * Load and parse a svg file.
   * @param {string} url – The url of the font's svg file.
   */
  // TODO accept item directly.
  async load(url) {
    this.item = await loadSVG(url, { insert: false })
    const { glyphs } = this.parse(this.item)
    this.glyphs = glyphs
  }

  /**
   * Parse the item.
   * @param {paper.Group} item - The item to parse.
   * @returns {FontInfo}
   */
  parse(item) {
    const glyphs = new Map()

    const children = item.children
    for (const child of children) {
      const { name } = child
      if (name) {
        const { unicodeValue } = aglfn.find(el => el.glyphName === name) || {}
        if (unicodeValue) {
          const charCode = parseInt(`0x${unicodeValue}`)
          glyphs.set(charCode, new Glyph(child))
        }
      }
    }

    return { glyphs }
  }
}
