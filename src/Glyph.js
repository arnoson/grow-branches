import { SymbolDefinition } from 'paper'

export class Glyph {
  constructor(item) {
    const clone = item.clone()
    clone.pivot = clone.firstChild.firstSegment.point
    this.symbol = new SymbolDefinition(clone)
  }

  createGlyphItem() {
    const { symbol } = this
    const instance = symbol.place()
    // When placing instances somehow the pivot of the the original item gets
    // lost, so we have to restore it manually.
    instance.pivot = symbol.item.pivot
    return instance
  }
}
