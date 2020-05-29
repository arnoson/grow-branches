import { CompoundTree } from './CompoundTree'
import { WordTree } from './WordTree'

const content = [
  // paragraph
  ['satz', 'eins'], // sentence
  ['satz', 'zwei'] // sentence
]

export class Branches {
  grow(content) {
    const tree = new CompoundTree()
    tree.grow(content)
  }
}
