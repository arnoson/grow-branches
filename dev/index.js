import paper, { view } from 'paper'
import { Font, Tree, WordTree } from '../src'
;(async () => {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  let tree
  document.querySelector('textarea').addEventListener('input', function () {
    tree && tree.remove()
    tree = new Tree({ font })
    const content = this.value.trim().split(' ')
    tree.grow(content)
    tree.item.scale(0.2)
    tree.position = view.center
  })
})()
