import paper from 'paper'
import { Font, WordTree } from '../src'

async function main() {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new WordTree({ font })
  let string = ''
  document.addEventListener('keydown', ({ key }) => {
    if (key.length === 1 && key.match(/[a-z]/)) {
      string += key
      tree.chop()
      tree.grow(string)
    } else if (key === 'Backspace') {
      string = string.slice(0, -1)
      tree.chop()
      if (string.length) {
        tree.grow(string)
      }
    }
    tree.position = paper.view.bounds.bottomCenter
  })
}
main()
