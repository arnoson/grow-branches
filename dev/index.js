import paper from 'paper'
import { Font, SentenceTree } from '../src'

async function main() {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new SentenceTree({
    font,
    wordOptions: {
      growingOrder: 'left-right',
      startAtTrunk: false
    }
  })

  let string = ''
  document.addEventListener('keydown', event => {
    const { key } = event
    if (key.length === 1 && key.match(/[a-z\s]/)) {
      string += key
      tree.chop()
    } else if (key === 'Backspace') {
      event.preventDefault()
      string = string.slice(0, -1)
      tree.chop()
    }

    if (string.length) {
      tree.grow(string.split(' '))
    }

    tree.position = paper.view.center
    tree.item.style = {
      strokeWidth: 5,
      strokeColor: 'rgba(0, 0, 255, 0.5)'
    }
  })
}
main()
