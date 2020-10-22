/**
 * @typedef {('natural'|'left-right'|'right-left'|'random')} GrowingOrder
 */

/**
 * @typedef {Object} WordTreeOptions
 * @property {Branches.Font} font The font.
 * @property {number} [branchBottomDistance] The minimum distance between the
 * lowest branch and the bottom.
 * @property {GrowingOrder} [growingOrder] The order in which the branches grow.
 * @property {boolean} [startAtTrunk] Wether or not to start growing branches
 * at the trunk.
 */

/**
 * @typedef {Object} FontInfo
 * @property {Map} glyphDefinitions The glyph definitions.
 */

/**
 * @typedef {Object} KerningInfo
 * @property {paper.Raster} raster The rasterized item.
 * @property {number} width The raster's width.
 * @property {number} height The raster's height.
 * @property {number} resolution The items's resolution.
 * @property {Object} edges The raster's left and right edge.
 */

/**
 * An array of either arrays or words. Each array will be a new Tree and each
 * word a WordTree.
 * @example
 * // This describes a tree consisting of two trees, each of them consisting of
 * // two word trees.
 * const content = [
 *    ['test', 'one],
 *    ['test', 'two']
 * ]
 * @typedef {Array} BranchesContent
 */
