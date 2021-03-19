import { Glyph, GlyphDefinition } from './index'

export type GrowingOrder = 'natural' | 'left-right' | 'right-left' | 'random'

export type GlyphDefinitions = Map<number, GlyphDefinition>

export type Glyphs = Array<Glyph>

export interface FontInfo {
  glyphDefinitions: GlyphDefinitions
}

export type WritingMode = 'left-to-right' | 'right-to-left'

export type BranchesSentence = Array<string>

export type BranchesContent =
  | Array<BranchesSentence>
  | BranchesSentence
  | string
