import { KerningInfo } from './KerningInfo'
import { view, Group } from 'paper'

export class Tree {
  /**
   * @param {object} param
   * @param {number} [kerningResolution] - The resolution for the rasterization
   * used in kerning. A higher value will result in more accurat kerning, but
   * will also take more time to kern.
   */
  constructor({ kerningResolution = 20 } = {}) {
    this.kerningResolution = kerningResolution
    this.charSpacing = 10
    this.item = new Group()
  }

  /**
   * Align (and kern) this tree after the specified tree.
   * @param {Branches.Tree} tree – The tree to be aligned after.
   */
  alignAfter(tree) {
    this.item.bounds.bottomLeft = tree.item.bounds.bottomRight
    this._kern(tree)
  }

  /**
   * Remove all child trees.
   */
  chop() {
    for (const tree of this.trees) {
      tree.remove()
    }
    this.item.removeChildren()
    this.trees = []
  }

  /**
   * Remove this tree and all children.
   */
  remove() {
    this.chop()
    this.item.remove()
  }

  /**
   * Add a child tree and it's item.
   * @private
   * @param {Branches.Tree} tree
   */
  _addTree(tree) {
    this.trees.push(tree)
    this.item.addChild(tree.item)
  }

  /**
   * Place a this tree next to the specified tree and move as close as possible
   * without the two trees crossing. Note: for performance reasons kerning uses
   * a raster internally and not paper.js' getIntersections method.
   * @private
   * @param {Branches.Tree} tree – The tree to kern with.
   */
  _kern(tree) {
    const { height: heightA, edges: edgesA } = new KerningInfo(tree)
    const { height: heightB, edges: edgesB } = new KerningInfo(this)

    // Loop through each row of pixels and calculate how much distance is
    // between the two trees at the given row. The smallest distance we measure
    // is how far we can push the trees into each other without them
    // overlapping.
    // We assume the trees are aligned at the bottom, so we iterate the rows
    // in descending order.
    const height = Math.min(heightA, heightB)
    let minDistance = null
    for (let i = 0; i < height; i++) {
      const edgeRight = edgesA.right
      const edgeLeft = edgesB.left
      const distance =
        edgeRight[edgeRight.length - 1 - i] + edgeLeft[edgeLeft.length - 1 - i]
      if (minDistance === null || distance < minDistance) {
        minDistance = distance
      }
    }

    const { kerningResolution } = this
    // Compensate irregular gaps between the trees (caused by low resolution
    // rasters). The value 20 is empirical.
    if (minDistance > 0) {
      minDistance += 20 / kerningResolution
    }

    // We calculated the minimal distance in the lower kerning resolution. So we
    // have to transform it in into view resolution.
    const kerning = minDistance * (view.resolution / kerningResolution)
    // Apply the kerning and make sure that there is 'char' spacing between the
    // trees.
    this.position.x -= kerning - this.charSpacing
  }

  get position() {
    return this.item.position
  }

  set position(value) {
    this.item.position = value
  }

  get bounds() {
    return this.item.bounds
  }

  set bounds(value) {
    this.item.bounds = value
  }
}
