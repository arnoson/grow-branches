import paper, { view } from 'paper'
import { Font, Tree } from '../src'
;(async () => {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new Tree({ font })
  tree.grow(['hallo', 'wie', 'geht', 'es', 'dir'])

  console.log(tree.item.strokeScaling)

  tree.item.scale(0.5)
  tree.position = view.bounds.bottomCenter.subtract(0, 100)
})()
