import paper, { view } from 'paper'
import { Font, WordTree } from '../src'
import { Kerner } from '../src/Kerner'
;(async () => {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const treeA = new WordTree({ font })
  treeA.grow('iiyll')
  treeA.position = [100, 400]

  const treeB = new WordTree({ font })
  treeB.grow('hellow')
  treeB.position = [300, 400]

  const kerner = new Kerner({ debug: true })
  kerner.kern(treeA.item, treeB.item)
})()
