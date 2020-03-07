import { Group, view } from 'paper'

export class WordTree {
  constructor({ font, word = null }) {
    this.word = word
    this.font = font
    this.item = new Group()
    word && this.grow(word)
  }

  grow(string) {
    const glyph = this._getGlyph(string[0])
    const glyphItem = glyph.createGlyphItem()
    glyphItem.position = view.center
    this._growRecursive(glyphItem, string.slice(1))
  }

  _growRecursive(prevGlyphItem, string) {
    if (string.length) {
      const glyph = this._getGlyph(string[0])

      for (const child of prevGlyphItem.children) {
        // Place glyph.
        const glyphItem = glyph.createGlyphItem()

        const tangentOut = child.lastCurve.getTangentAt(child.lastCurve.length)
        const tangentIn = glyphItem.firstChild.firstCurve.getTangentAt(0)

        glyphItem.rotate(tangentOut.angle + 90)
        glyphItem.rotate((tangentIn.angle + 90) * -1)
        glyphItem.position = child.lastSegment.point
        this._growRecursive(glyphItem, string.slice(1))
      }
    }
  }

  _getGlyph(char) {
    const glyph = this.font.glyphs.get(char.charCodeAt(0))
    if (!glyph) {
      throw new Error(`Couldn't find glyph for char '${char}'`)
    }
    return glyph
  }
}
