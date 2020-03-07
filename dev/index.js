import paper from 'paper'
import { Font, WordTree } from '../src'

async function main() {
  paper.setup(document.querySelector('canvas'))

  const font = new Font()
  await font.load(require('../src/branches.svg'))

  const tree = new WordTree({
    word: 'asterix',
    font
  })
}
main()
