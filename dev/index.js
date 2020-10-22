import paper, { view } from 'paper'
import { Font, Tree, WordTree } from '../src'
;(async () => {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new Tree({ font })
  tree.grow(['hallo', 'wie', 'geht', 'es', 'dir'])
  tree.item.scale(0.5)
  tree.position = view.bounds.bottomCenter.subtract(100)
})()
