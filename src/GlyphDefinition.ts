import { Glyph } from './Glyph'

export class GlyphDefinition {
  angleIn: number

  /**
   * @param item The original glyph item.
   */
  constructor(public item: paper.Group) {
    if (!item.children) {
      throw new Error('Glyph item has to have at least one child.')
    }

    for (const child of item.children) {
      if (child.className !== 'Path') {
        throw new Error(`Glyph item's children have to be paths.`)
      }
    }

    item.strokeScaling = false
    const firstBranch = item.firstChild as paper.Path
    this.angleIn = firstBranch.firstCurve.getTangentAt(0).angle
  }

  /**
   * Create a new instance.
   */
  instance() {
    return new Glyph(this)
  }
}
