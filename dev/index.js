import paper from 'paper'
import { Font, Tree } from '../src'
;(async () => {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new Tree({ font })
  tree.grow([
    'es war einmal'.split(' '),
    'und ist nicht mehr'.split(' '),
    'ein weltberuehmter'.split(' '),
    ['teddybaer']
  ])
  tree.item.scale(0.3)
  tree.bounds.center = paper.view.center
})()
