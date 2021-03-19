import * as paper from 'paper'

export class BaseTree {
  item = new paper.Group()
  trees: BaseTree[]
  trunk: paper.Path

  constructor() {
    this.trunk = new paper.Path({
      name: 'trunk',
      strokeColor: 'blue',
      strokeScaling: false
    })
    this.item.addChild(this.trunk)
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
