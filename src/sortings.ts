import { shuffleArray } from './utils'
import { GlyphBranches } from './Glyph'

export const sortings = {
  natural: (branches: GlyphBranches) => branches,

  'left-right': (branches: GlyphBranches) =>
    branches.sort((a, b) => a.lastSegment.point.x - b.lastSegment.point.x),

  'right-left': (branches: GlyphBranches) =>
    branches.sort((a, b) => b.lastSegment.point.x - a.lastSegment.point.x),

  random: (branches: GlyphBranches) => shuffleArray(branches) as GlyphBranches
}
