import { KerningInfo } from './KerningInfo'
import { view, Group } from 'paper'

export class Tree {
  constructor({ kerningResolution = 3 } = {}) {
    this.kerningResolution = kerningResolution
    this.charSpacing = 10
    this.kerningInfo = new KerningInfo(this)
    this.item = new Group()
  }

  _addTree(tree) {
    this.trees.push(tree)
    this.item.addChild(tree.item)
  }

  _update() {
    this.kerningInfo.update()
  }

  kern(tree) {
    const treeA = tree
    const treeB = this

    const { width: widthA, height: heightA, edges: edgesA } = treeA.kerningInfo
    const { width: widthB, height: heightB, edges: edgesB } = treeB.kerningInfo
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

    const resolution = 3
    const kerning = minDistance * (view.resolution / resolution)
    treeB.position.x -= kerning - this.charSpacing
  }

  alignAfter(tree) {
    this.item.bounds.bottomLeft = tree.item.bounds.bottomRight
  }

  chop() {
    for (const tree of this.trees) {
      tree.remove()
    }
    this.item.removeChildren()
    this.trees = []
  }

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
