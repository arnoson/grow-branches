/**
 * @typedef {Object} KerningInfo
 * @property {paper.Raster} raster - The rasterized item.
 * @property {number} width - The raster's width.
 * @property {number} height - The raster's height.
 * @property {number} resolution - The items's resolution.
 * @property {Object} edges - The raster's left and right edge.
 */

export class Kerner {
  /**
   * @param {Object} [param]
   * @param {number} [param.resolution] – The resolution in which the items will
   * be rasterized.
   * @param {number} [param.spacing] – The space between two kerned items in px.
   * @param {string='left-to-right', 'right-to-left'} [param.writingMode] – The
   * writing mode.
   * @param {boolean} [param.debug] – Wether or not to show debugging
   * information.
   */
  constructor({
    resolution = 10,
    spacing = 20,
    writingMode = 'left-to-right',
    debug = false
  } = {}) {
    this.resolution = resolution
    this.spacing = spacing
    this.writingMode = writingMode
    this.debug = debug
    this.isLeftToRight = writingMode === 'left-to-right'
  }

  /**
   * Get kerning information for the provided item.
   * @private
   * @param {paper.Iten} item
   * @returns {KerningInfo}
   */
  _getKerningInfo(item) {
    // If stroke width ist too thin, some paths might get lost in rasterization.
    // 1px width works with 72 dpi, so we increase the strokeWidth as the
    // resolution decreases.
    const { strokeWidth } = item
    const { resolution } = this
    item.strokeWidth = 72 / resolution

    const raster = item.rasterize(resolution, this.debug)
    item.strokeWidth = strokeWidth

    return {
      raster,
      edges: this._getEdges(raster, this.direction),
      width: raster.width,
      height: raster.height,
      resolution: item.view.resolution
    }
  }

  /**
   * Place itemA next to itemB and move as close as possible without the two
   * items colliding. For performance reasons we use a raster instead of
   * paper.js' getIntersections method.
   * @private
   * @param {paper.Item} itemA – The item to be kerned.
   * @param {paper.Item} itemB – The item to be kerned with.
   */
  kern(itemA, itemB) {
    const infoA = this._getKerningInfo(itemA)
    const infoB = this._getKerningInfo(itemB)

    // When the writing mode is left to right we want to compare the left edge
    // of itemA with the right edge of itemB. Otherwise the other way round.
    const { isLeftToRight } = this
    const [edgeRight, edgeLeft] = isLeftToRight
      ? [infoB.edges.right, infoA.edges.left]
      : [infoA.edges.right, infoB.edges.left]

    // Loop through each row of pixels and calculate how much distance is
    // between the two items at any given row. The smallest distance we measure
    // determines how far we can push the objects into each other without them
    // overlapping. We assume the items are aligned at the bottom, so we iterate
    // the rows in descending order.
    const height = Math.min(infoA.height, infoB.height)
    let minDistance = null
    for (let i = 0; i < height; i++) {
      const distance =
        edgeRight[edgeRight.length - 1 - i] + edgeLeft[edgeLeft.length - 1 - i]
      if (minDistance === null || distance < minDistance) {
        minDistance = distance
      }
    }

    // Compensate irregular gaps between the items (caused by low resolution
    // rasters). The value 20 is empirical.
    const { resolution } = this
    if (minDistance > 0) {
      minDistance += 20 / resolution
    }

    // Align itemA next to itemB.
    if (isLeftToRight) {
      itemA.bounds.bottomLeft = itemB.bounds.bottomRight
    } else {
      itemA.bounds.bottomRight = itemB.bounds.bottomLeft
    }

    // We calculated the minimal distance using the kerning resolution, so we
    // have to translate it into the item's view resolution.
    const kerning = minDistance * (infoA.resolution / resolution)
    // Apply kerning and spacing to the item.
    itemA.position.x += (kerning - this.spacing) * (isLeftToRight ? -1 : 1)

    if (this.debug) {
      // Align the raster with it's item.
      infoA.raster.bounds.topLeft = itemA.bounds.topLeft
    }
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
