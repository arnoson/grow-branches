import paper from 'paper'
import { Font } from '../src'

paper.setup(document.querySelector('canvas'))

const font = new Font()
font.load(require('../src/branches.svg'))
