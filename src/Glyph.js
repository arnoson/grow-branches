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
    const { item } = this
    // First, rotate this glyph so it points in the same direction as
    // the branch.
    const tangentOut = branch.lastCurve.getTangentAt(branch.lastCurve.length)
    item.rotate(tangentOut.angle + 90)
    // Not all glyphs start with a straight trunk. If the trunk is curved we
    // compensate for it's starting angle, so the connection between the
    // child and the glyph is smooth.
    item.rotate((this.angleIn + 90) * -1)

    // Position the glyph item at the child's end point.
    item.position = branch.lastSegment.point
  }

  isLowerThan(glyph) {
    return this.item.bounds.bottomLeft.y > glyph.item.bounds.bottomLeft.y
  }

  /**
   * Sort the branches of the glyph.
   * @param {GrowingOrder} order - The sorting order.
   * @returns {Array<paper.Path>}
   */
  sortBranches(order) {
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
    if (this.startAtTrunk) {
      const index = sorted.indexOf(glyph.trunk)
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
