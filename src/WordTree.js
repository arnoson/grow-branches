import { Group, view } from 'paper'

export class WordTree {
  /**
   * @param {Object} param
   * @param {Branches.Font} font – The font.
   * @param {string} [word] - The word to grow.
   */
  constructor({ font, word = null }) {
    this.word = word
    this.font = font
    this.glyphItems = new Group()
    word && this.grow(word)
  }

  /**
   * Grow a word.
   * @param {string} string – The word to grow.
   */
  grow(string) {
    const glyph = this._getGlyph(string[0])
    const glyphItem = glyph.createGlyphItem()
    glyphItem.position = view.center
    this._growRecursive(glyphItem, string.slice(1))
  }

  /**
   * Continue growing the word recursively.
   * @private
   * @param {paper.Group} prevGlyphItem - The previous glyph item.
   * @param {string} string - The remaining characters to grow.
   */
  _growRecursive(prevGlyphItem, string) {
    const { glyphItems } = this

    // Only keep growing if we have characters left.
    if (string.length) {
      const glyph = this._getGlyph(string[0])

      // Add a glyph item to the trunk and each branch of the previous glyph
      // item.
      for (const child of prevGlyphItem.children) {
        const glyphItem = glyph.createGlyphItem()

        const tangentOut = child.lastCurve.getTangentAt(child.lastCurve.length)
        const tangentIn = glyphItem.firstChild.firstCurve.getTangentAt(0)
        // First, rotate the glyph item so it points in the same direction as
        // the child.
        glyphItem.rotate(tangentOut.angle + 90)
        // Not all glyphs start with a straight trunk. If the trunk is curved we
        // compensate for it's starting angle, so the connection between the
        // child and the glyph is smooth.
        glyphItem.rotate((tangentIn.angle + 90) * -1)

        // Position the glyph item at the child's end point.
        glyphItem.position = child.lastSegment.point

        // The glyph item is not allowed to cross the tree (meaning the already
        // existing glyph items). If it crosses, we remove it and stop the
        // growing.
        if (this._crossesGlyphItem(glyphItem)) {
          glyphItem.remove()
        } else {
          glyphItems.addChild(glyphItem)
          this._growRecursive(glyphItem, string.slice(1))
        }
      }
    }
  }

  /**
   * Get the corresponding glyph for the character.
   * @private
   * @param {string} char - The character.
   * @returns {Branches.Glyph}
   */
  _getGlyph(char) {
    const glyph = this.font.glyphs.get(char.charCodeAt(0))
    if (!glyph) {
      throw new Error(`Couldn't find glyph for char '${char}'`)
    }
    return glyph
  }

  _crossesGlyphItem(glyphItem) {
    const glyphItemA = glyphItem
    for (const childA of glyphItemA.children) {
      for (const glyphItemB of this.glyphItems.children) {
        for (const childB of glyphItemB.children) {
          if (childA.getCrossings(childB).length) {
            return true
          }
        }
      }
    }
    return false
  }
}
