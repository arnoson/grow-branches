import { Group } from 'paper'
import { Tree } from './Tree'
import { WordTree } from './WordTree'

export class SentenceTree extends Tree {
  constructor({ font, words = [], wordOptions }) {
    super()
    this.font = font
    this.words = words
    this.wordOptions = wordOptions
    this.trees = []
    words.length && this.grow(words)
  }

  grow(words) {
    const { font } = this
    let prevTree = null
    for (const word of words) {
      const tree = new WordTree({ font, word, ...this.wordOptions })
      if (prevTree) {
        tree.alignAfter(prevTree)
        tree.kern(prevTree)
      }
      this._addTree(tree)
      prevTree = tree
    }
  }
}
