import { Glyph } from './Glyph'

export class GlyphDefinition {
  /**
   * @param {paper.Group} item  – The original glyph item.
   */
  constructor(item) {
    this.item = item
    item.strokeScaling = false
    this.angleIn = item.firstChild.firstCurve.getTangentAt(0).angle
  }

  /**
   * Create a new instance.
   * @returns {Branches.Glyph}
   */
  instance() {
    return new Glyph(this)
  }
}
