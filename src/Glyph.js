import { project } from 'paper'
import { shuffleArray } from './utils'

export class Glyph {
  /**
   * @param {Branches.GlyphDefinition} definition – The definition for the
   * glyph.
   */
  constructor(definition) {
    this.definition = definition
    const item = (this.item = definition.item.clone())
    project.activeLayer.addChild(item)
    this.branches = item.children
    this.trunk = item.firstChild
    item.pivot = this.trunk.firstSegment.point
  }

  /**
   * Align the glyph at the end of the branch.
   * @param {paper.Path} branch
   */
  alignAtBranch(branch) {
    // Rotate the glyph so it's trunk starts growing vertical.
    this.alignVertical()
    const { item } = this
    // Now rotate this glyph so it points in the same direction as the branch.
    const tangentOut = branch.lastCurve.getTangentAt(branch.lastCurve.length)
    item.rotate(tangentOut.angle + 90)

    // Position the glyph item at the child's end point.
    item.position = branch.lastSegment.point
  }

  alignVertical() {
    this.item.rotate((this.angleIn + 90) * -1)
  }

  isLowerThan(glyph) {
    return this.item.bounds.bottomLeft.y > glyph.item.bounds.bottomLeft.y
  }

  /**
   * Sort the branches of the glyph.
   * @param {GrowingOrder} order - The sorting order.
   * @param {boolean} order - Wether or not to start growing branches at the
   * trunk.
   * @returns {Array<paper.Path>}
   */
  sortBranches(order, startAtTrunk) {
    const branches = [...this.branches]
    const stortings = {
      natural: array => array,
      'left-right': array =>
        array.sort((a, b) => a.lastSegment.point.x - b.lastSegment.point.x),
      'right-left': array =>
        array.sort((a, b) => b.lastSegment.point.x - a.lastSegment.point.x),
      random: array => shuffleArray(array)
    }

    // Sort the branches and move the trunk to the beginning, if necessary.
    const sorted = stortings[order](branches)
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
