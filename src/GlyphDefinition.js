import { Glyph } from './Glyph'

export class GlyphDefinition {
  /**
   * @param {paper.Group} item  – The original glyph item.
   */
  constructor(item) {
    this.item = item
    this.angleIn = this.item.firstChild.firstCurve.getTangentAt(0).angle
  }

  /**
   * Return a new instance.
   * @returns {Branches.Glyph}
   */
  instance() {
    return new Glyph(this)
  }
}
