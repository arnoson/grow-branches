import { SymbolDefinition, project } from 'paper'

export class Glyph {
  /**
   * @param {paper.Group} item  – The original glyph item.
   */
  constructor(item) {
    this.item = item
    // All children of a glyph are it's branches. The first item also is the
    // trunk.
    this.trunk = item.firstChild
    item.pivot = this.trunk.firstSegment.point
    this.angleIn = this.trunk.firstCurve.getTangentAt(0).angle
  }

  createGlyphItem() {
    // ? where should new glyph instances be inserted?
    return project.activeLayer.addChild(this.item.clone())
  }
}
