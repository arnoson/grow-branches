import { Group } from 'paper'
import { Kerner } from './Kerner'

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
    this.kerner = new Kerner()
  }

  /**
   * Align (and kern) this tree after the specified tree.
   * @param {paper.Item} item – The item to be aligned after.
   */
  alignAfter(item) {
    this.kerner.kern(this.item, item)
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
  _addChildTree(tree) {
    this.trees.push(tree)
    this.item.addChild(tree.item)
  }

  _alignChildTrees() {
    const { item, trees } = this
    const { a, center, b } = this._divideTrees(trees)

    let i = 0
    const alignTreesInGroup = trees => {
      const group = new Group()
      for (const tree of trees) {
        group.children.length && tree.alignAfter(group)
        group.addChild(tree.item)
      }
      group.strokeColor = i++ === 0 ? 'red' : 'blue'
      return group
    }

    const itemA = item.addChild(alignTreesInGroup(a))
    const itemB = item.addChild(alignTreesInGroup(b))

    itemA.rotate(-90)
    itemB.rotate(90)
  }

  /**
   * Divide trees in two groups and a center tree.
   * @param {Array<Branches.Tree>} trees
   */
  _divideTrees(trees) {
    const a = []
    const b = []
    let center

    if (trees.length === 1) {
      // If there is only one tree, we will place it at the center.
      center = trees[0]
    } else if (trees.length === 2) {
      // We always want a center tree, so two trees are divided into group a
      // and center.
      a.push(trees[0])
      center = trees[1]
    } else if (trees.length === 3) {
      // Three trees get divided one in each group.
      a.push(trees[0])
      center = trees[1]
      b.push(trees[2])
    } else {
      // If there are more than three trees, we first make two equally sized
      // groups, based on the width of the trees.
      const reduceTotalWidth = (acc, tree) => acc + tree.item.bounds.width
      const halfWidth = trees.reduce(reduceTotalWidth, 0) / 2

      let width = 0
      for (const tree of trees) {
        width += tree.bounds.size.width
        const side = width < halfWidth ? a : b
        side.push(tree)
      }

      // Now we pick the center tree from the bigger group.
      const widthA = a.reduce(reduceTotalWidth, 0)
      const widthB = b.reduce(reduceTotalWidth, 0)
      center = widthA > widthB ? a.pop() : b.shift()
    }

    return { a, center, b }
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
