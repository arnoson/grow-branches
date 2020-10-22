import aglfn from 'aglfn'
import { GlyphDefinition } from './GlyphDefinition'
import { loadSVG } from './utils'
import './typedef'

export class Font {
  /** @type {string} */
  url
  /** @type {paper.Group} */
  item
  /** @type {Map} */
  glyphDefinitions = new Map()

  /**
   * Load and parse a svg file.
   * @param {string} url The url of the font's svg file.
   */
  // TODO accept item directly.
  async load(url) {
    this.item = await loadSVG(url, { insert: false })
    const { glyphDefinitions } = this._parse(this.item)
    this.glyphDefinitions = glyphDefinitions
  }

  /**
   * Parse the item.
   * @param {paper.Group} item The item to parse.
   * @returns {FontInfo}
   */
  _parse(item) {
    const glyphDefinitions = new Map()

    const children = item.children
    for (const child of children) {
      if (!child) {
        throw new Error(`Font items's children have to be groups.`)
      }
      const { name } = child
      if (name) {
        const { unicodeValue } = aglfn.find((el) => el.glyphName === name) || {}
        if (unicodeValue) {
          const charCode = parseInt(`0x${unicodeValue}`)
          glyphDefinitions.set(
            charCode,
            new GlyphDefinition(/** @type {paper.Group} */ (child))
          )
        }
      }
    }

    return { glyphDefinitions }
  }
}
