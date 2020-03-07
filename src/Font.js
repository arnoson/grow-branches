import aglfn from 'aglfn'
import { Glyph } from './Glyph'
import paper from 'paper'
import { loadSVG } from './utils'

export class Font {
  constructor(scope = paper) {
    this.url = null
    this.scope = scope
    this.item = null
    this.glyphs = new Map()
  }

  async load(url) {
    this.item = await loadSVG(url, { insert: false })
    const { glyphs } = this.parse(this.item)
    this.glyphs = glyphs
  }

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
