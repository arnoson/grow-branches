import paper, { view } from 'paper'
import { Font, Tree } from '../src'
;(async () => {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new Tree({ font })
  tree.grow(['grow', 'a', 'branches', 'now'])

  console.log(tree.item)

  tree.item.strokeScaling = false
  tree.item.scale(0.5)
  tree.item.strokeWidth = 10
  tree.position = view.center
})()
