import { Group, view } from 'paper'

/**
 * @typedef {'natural', 'left-right', 'right-left', 'random'} GrowingOrder
 */

export class WordTree {
  /**
   * @param {object} param
   * @param {Branches.Font} param.font – The font.
   * @param {string} [param.word] - The word to grow.
   * @param {number} [param.branchBottomDistance] - The minimum distance between
   * the lowest branch and the bottom.
   * @param {GrowingOrder} [param.growingOrder] – The order in which the
   * branches grow.
   * @param {boolean} [param.startAtTrunk] - Wether or not to start growing
   * branches at the trunk.
   */
  constructor({
    font,
    word = null,
    branchBottomDistance = 30,
    growingOrder = 'natural',
    startAtTrunk = true
  }) {
    this.word = word
    this.font = font
    this.branchBottomDistance = branchBottomDistance
    this.growingOrder = growingOrder
    this.startAtTrunk = startAtTrunk
    this.glyphs = []
    this.lowestGlyph = null
    this.item = new Group()
    word && this.grow(word)
  }

  /**
   * Grow a word.
   * @param {string} string – The word to grow.
   */
  grow(string) {
    const glyph = this._createGlyph(string[0])
    this._addGlyph(glyph)
    this._growRecursive(glyph, string.slice(1))
    this._adjustTrunk()
    this.item.pivot = glyph.item.pivot
  }

  chop() {
    for (const glyph of this.glyphs) {
      glyph.remove()
    }
    this.glyphs = []
    this.lowestGlyph = null
  }

  /**
   * Continue growing the word recursively.
   * @private
   * @param {Branches.Glyph} prevGlyph - The previous glyph.
   * @param {string} string - The remaining characters to grow.
   */
  _growRecursive(prevGlyph, string) {
    // Only keep growing if we have characters left.
    if (string.length) {
      // Add a glyph to each branch of the previous glyph.
      const branches = prevGlyph.sortBranches(this.growingOrder)
      for (const branch of branches) {
        const glyph = this._createGlyph(string[0])
        glyph.alignAtBranch(branch)

        this._adjustTrunk()

        if (this._crossesGlyph(glyph)) {
          glyph.remove()
        } else {
          const { lowestGlyph } = this
          this.lowestGlyph =
            !lowestGlyph || glyph.isLowerThan(lowestGlyph) ? glyph : lowestGlyph

          this._addGlyph(glyph)
          this._growRecursive(glyph, string.slice(1))
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
  _createGlyph(char) {
    const definition = this.font.glyphDefinitions.get(char.charCodeAt(0))
    if (!definition) {
      throw new Error(`Couldn't find glyph definition for char '${char}'`)
    }
    return definition.instance()
  }

  /**
   * Add a glyph and it's item.
   * @private
   * @param {Branches.Glyph} glyph
   */
  _addGlyph(glyph) {
    this.glyphs.push(glyph)
    this.item.addChild(glyph.item)
  }

  /**
   * Check if a glyph crosses this tree.
   * @private
   * @param {Branches.Glyph} glyph
   * @returns {boolean} – Wether or not the glyph crosses.
   */
  _crossesGlyph(glyph) {
    const { glyphs } = this
    for (let i = 0; i < glyphs.length; i++) {
      for (const branchA of glyph.branches) {
        for (const branchB of glyphs[i].branches) {
          // Get intersections, but exclude the trunk's starting point, because
          // they should intersect there.
          const intersections = branchA.getIntersections(
            branchB,
            inter => !inter.point.equals(glyph.trunk.firstSegment.point)
          )
          // Allow one intersection, if it isn't a crossing. If branches can
          // touch themselves at one point it will result in a 'fuller' tree.
          if (
            intersections.length &&
            (intersections.length > 1 || intersections[0].isCrossing())
          ) {
            return true
          }
        }
      }
    }
    return false
  }

  /**
   * Extend the trunk, so that the lowest branch doesn't touch the ground.
   */
  _adjustTrunk() {
    const { lowestGlyph, branchBottomDistance } = this
    if (lowestGlyph) {
      const firstGlyph = this.glyphs[0]
      const distance =
        this.lowestGlyph.item.bounds.bottomLeft.y - firstGlyph.position.y
      if (distance > branchBottomDistance * -1) {
        const { trunk } = firstGlyph
        trunk.insert(0, trunk.firstSegment)
        trunk.firstSegment.point.y += distance + branchBottomDistance
        firstGlyph.item.pivot = trunk.firstSegment.point
      }
    }
  }

  set position(value) {
    this.item.position = value
  }

  get position() {
    return this.item.position
  }
}
