import { SymbolDefinition, project } from 'paper'

export class Glyph {
  constructor(item) {
    item.pivot = item.firstChild.firstSegment.point
    this.item = item
  }

  createGlyphItem() {
    // ? where should new glyph instances be inserted?
    return project.activeLayer.addChild(this.item.clone())
  }
}
