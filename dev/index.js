import paper from 'paper'
import { Font, SentenceTree } from '../src'

async function main() {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new SentenceTree({
    font,
    words: ['arno', 'tested', 'das'],
    wordOptions: {
      growingOrder: 'left-right',
      startAtTrunk: false
    }
  })

  tree.position = paper.view.center

  let string = ''
  document.addEventListener('keydown', event => {
    const { key } = event

    let grow = false

    if (key.length === 1 && key.match(/[a-z\s]/)) {
      string += key
      tree.chop()
      grow = true
    } else if (key === 'Backspace') {
      event.preventDefault()
      string = string.slice(0, -1)
      tree.chop()
      grow = true
    }

    if (grow && string.length) {
      tree.grow(string.trim().split(' '))
    }

    tree.position = paper.view.center
  })
}
main()
