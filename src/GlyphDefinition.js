import { Glyph } from './Glyph'

export class GlyphDefinition {
  /**
   * @param {paper.Group} item The original glyph item.
   */
  constructor(item) {
    if (!item.children) {
      throw new Error('Glyph item has to have at least one child.')
    }

    for (const child of item.children) {
      if (child.className !== 'Path') {
        throw new Error(`Glyph item's children have to be paths.`)
      }
    }

    this.item = item
    item.strokeScaling = false
    this.angleIn = item.firstChild.firstCurve.getTangentAt(0).angle
  }

  /**
   * Create a new instance.
   */
  instance() {
    return new Glyph(this)
  }
}
