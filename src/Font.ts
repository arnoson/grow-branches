import aglfn from 'aglfn'
import { GlyphDefinition } from './GlyphDefinition'
import { loadSVG } from './utils'
import { FontInfo, GlyphDefinitions } from './typedef'

export class Font {
  url: string
  item: paper.Group
  glyphDefinitions: GlyphDefinitions

  /**
   * Load and parse a svg file.
   * @param url The url of the font's svg file.
   */
  // TODO accept item directly.
  async load(url: string) {
    this.item = await loadSVG(url, { insert: false })
    const { glyphDefinitions } = this._parse(this.item)
    this.glyphDefinitions = glyphDefinitions
  }

  /**
   * Parse the item.
   * @param item The item to parse.
   * @returns {FontInfo}
   */
  _parse(item: paper.Group): FontInfo {
    const glyphDefinitions: GlyphDefinitions = new Map()

    const children = item.children
    for (const child of children) {
      if (!child) {
        throw new Error(`Font item's children have to be groups.`)
      }
      const { name } = child
      if (name) {
        const { unicodeValue } = aglfn.find(el => el.glyphName === name) || {}
        if (unicodeValue) {
          const charCode = parseInt(`0x${unicodeValue}`)
          glyphDefinitions.set(
            charCode,
            new GlyphDefinition(child as paper.Group)
          )
        }
      }
    }

    return { glyphDefinitions }
  }
}
