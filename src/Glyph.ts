import paper from 'paper'
import { GlyphDefinition } from './GlyphDefinition'
import { GrowingOrder } from './typedef'
import { sortings } from './sortings'

export type GlyphBranches = Array<paper.Path>

export class Glyph {
  item: paper.Group
  branches: GlyphBranches
  trunk: paper.Path

  constructor(public definition: GlyphDefinition) {
    const item = (this.item = definition.item.clone())

    paper.project.activeLayer.addChild(item)
    this.branches = item.children as GlyphBranches

    this.trunk = item.firstChild as paper.Path
    item.pivot = this.trunk.firstSegment.point
  }

  /**
   * Align the glyph at the end of the branch.
   */
  alignAtBranch(branch: paper.Path) {
    this.alignVertical()
    const { item } = this

    // Rotate the glyph so it points in the same direction as the branch.
    const tangentOut = branch.lastCurve.getTangentAt(branch.lastCurve.length)
    item.rotate(tangentOut.angle + 90)

    // Position the glyph at the branch's end point.
    item.position = branch.lastSegment.point
  }

  /**
   * Rotate the glyph so it's trunk starts growing vertically.
   */
  alignVertical() {
    this.item.rotate((this.angleIn + 90) * -1)
  }

  /**
   * Check if the glyph is 'hanging' lower than the specified glyph.
   */
  isLowerThan(glyph: Glyph) {
    return this.item.bounds.bottomLeft.y > glyph.item.bounds.bottomLeft.y
  }

  /**
   * Sort the branches of the glyph.
   * @param order The sorting order.
   * @param startAtTrunk Wether or not to start growing branches at the trunk.
   */
  sortBranches(order: GrowingOrder, startAtTrunk: boolean) {
    const branches = [...this.branches]
    // Sort the branches and move the trunk to the beginning, if necessary.
    const sorted = sortings[order](branches)
    if (startAtTrunk) {
      const index = sorted.indexOf(this.trunk)
      sorted.unshift(sorted.splice(index, 1)[0])
    }
    return sorted
  }

  /**
   * Remove the glyph.
   */
  remove() {
    this.item.remove()
  }

  set position(value) {
    this.item.position = value
  }

  get position() {
    return this.item.position
  }

  get angleIn() {
    return this.definition.angleIn
  }
}
