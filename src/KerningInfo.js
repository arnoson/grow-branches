export class KerningInfo {
  /**
   * @param {Branches.Tree} tree
   */
  constructor(tree) {
    this.tree = tree
    this.debug = false

    // If stroke width ist too thin, some paths might get lost in rasterization.
    // 1px width works with 72 dpi, so we increase the strokeWidth as the
    // resolution decreases.
    const { strokeWidth } = tree.item
    const { kerningResolution } = tree
    tree.item.strokeWidth = 72 / kerningResolution

    const raster = tree.item.rasterize(kerningResolution, false)
    tree.item.strokeWidth = strokeWidth

    // Add the raster to the tree's item so it will move with the tree. This is
    // usefull for debugging.
    this.debug && tree.item.addChild(raster)

    this.edges = this._getEdges(raster)
    this.width = raster.width
    this.height = raster.height
  }

  /**
   * @private
   * @param {paper.Raster} raster
   * @returns {object} - The left and right edge.
   */
  _getEdges(raster) {
    return {
      left: this._getEdge(raster, 'left'),
      right: this._getEdge(raster, 'right')
    }
  }

  /**
   * Find the left or right edge of the raster.
   * @private
   * @param {paper.Raster} raster
   * @param {string='left', 'right'} side
   * @returns {Array<number>}
   */
  _getEdge(raster, side) {
    const edge = []
    const { width, height } = raster
    const sideLeft = side === 'left'

    if (width && height) {
      // Loop through each row and check how much space (transparent pixels) is
      // there before a non-transparent pixel begins.
      const imageData = raster.getImageData()
      for (let y = 0; y < height; y++) {
        for (let i = 0; i < width; i++) {
          const x = sideLeft ? i : width - 1 - i
          if (this._getPixelAlpha(imageData, x, y)) {
            edge[y] = sideLeft ? x : width - 1 - x
            this.debug && raster.setPixel(x, y, sideLeft ? 'red' : 'blue')
            break
          }
        }
      }
    } else {
      // If paths got lost in rasterization, resulting in a raster with zero
      // width we return a zero edge.
      for (let i = 0; i < height; i++) {
        edge[i] = 0
      }
    }

    return edge
  }

  /**
   * Get the alpha value of a pixel.
   * @private
   * @param {ImageData} imageData
   * @param {number} x
   * @param {number} y
   * @returns {number} The alpha value.
   */
  _getPixelAlpha(imageData, x, y) {
    return imageData.data[(y * imageData.width + x) * 4 + 3]
  }
}
