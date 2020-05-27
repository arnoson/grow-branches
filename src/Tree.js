import { Group, Path } from 'paper'
import { Kerner } from './Kerner'

export class Tree {
  /**
   * @param {object} param
   * @param {number} [kerningResolution] - The resolution for the rasterization
   * used in kerning. A higher value will result in more accurat kerning, but
   * will also take more time to kern.
   */
  constructor({ kerningResolution = 20, charSpacing = 10 } = {}) {
    this.kerningResolution = kerningResolution
    this.charSpacing = charSpacing

    this.kerner = new Kerner()
    this.trees = []

    const item = (this.item = new Group())
    this.trunk = item.addChild(new Path({ name: 'trunk', strokeColor: 'blue' }))

    this.sideLeft = item.addChild(
      new Group({ name: 'side left', applyMatrix: false, rotation: -90 })
    )
    this.sideRight = item.addChild(
      new Group({ name: 'side right', applyMatrix: false, rotation: 90 })
    )
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
  _addTree(tree) {
    this.trees.push(tree)
    this.kerner.kern(tree.item, this.item)
    this.item.addChild(tree.item)
  }

  /**
   * Distribute the trees into left and right side.
   * @private
   * @returns {Object} – An object containing the distributed trees.
   */
  _distributeTrees() {
    const { item, trees } = this

    let center
    const left = []
    const right = []

    if (trees.length === 1) {
      // If there is only one tree, we will place it at the center.
      center = trees[0]
    } else if (trees.length === 2) {
      // We always want a center tree, so two trees are divided into left group
      // and center.
      left.push(trees[0])
      center = trees[1]
    } else if (trees.length === 3) {
      // Three trees get divided one in each group.
      left.push(trees[0])
      center = trees[1]
      right.push(trees[2])
    } else {
      // If there are more than three trees, we divide them in the center.
      const threshold = item.bounds.center.x
      for (const tree of trees) {
        const side = tree.position.x < threshold ? left : right
        side.push(tree)
      }
      // Then we pick the smaller of the two outer trees as the center tree.
      // Most of the time this just looks best.
      center =
        left[left.length - 1].item.bounds.width < right[0].item.bounds.width
          ? left.pop()
          : right.shift()
    }

    return { left, center, right }
  }

  /**
   * @private
   * @param {Array<Branches.Tree>} trees
   */
  _getTreesWidth(trees) {
    return trees[trees.length - 1].item.bounds.x - trees[0].item.bounds.x
  }

  /**
   * Distribute the trees into left and right side an the center tree and align
   * them around the trunk.
   * @private
   */
  _alignTrees() {
    const { sideLeft, sideRight } = this
    const { left, center, right } = this._distributeTrees()

    sideLeft.removeChildren()
    sideLeft.addChildren(left.map(tree => tree.item))

    sideRight.removeChildren()
    sideRight.addChildren(right.map(tree => tree.item))

    const [smallerSide, biggerSide] =
      sideLeft.bounds.height < sideRight.bounds.height
        ? [sideLeft, sideRight]
        : [sideRight, sideLeft]

    const maxHeight = biggerSide.bounds.height

    // 'Stretch' the smaller side so it fits to the bigger side. We don't
    // actually stretch the trees, but their positions.
    const stretchFactor = maxHeight / smallerSide.bounds.height
    for (const item of smallerSide.children) {
      item.position.x *= stretchFactor
    }

    // Adjust trunk.
    const { trunk } = this
    trunk.segments = [
      [0, 0],
      [0, maxHeight]
    ]

    // Align both sides and the center tree around the trunk.
    sideLeft.bounds.rightCenter = trunk.bounds.leftCenter
    sideRight.bounds.leftCenter = trunk.bounds.rightCenter
    center.item.position = trunk.bounds.topCenter
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
