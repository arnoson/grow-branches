import { Group, Path } from 'paper'

export class BaseTree {
  item = new Group()
  /** @type {BaseTree[]} */
  trees = []

  constructor() {
    this.trunk = this.item.addChild(
      new Path({ name: 'trunk', strokeColor: 'blue', strokeScaling: false })
    )
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
