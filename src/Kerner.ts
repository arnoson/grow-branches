import { WritingMode } from './typedef'

export interface KerningInfo {
  /**
   * The rasterized item.
   */
  raster: paper.Raster
  /**
   * The raster's width
   */
  width: number
  /**
   * The raster's height.
   */
  height: number
  /**
   * The item's resolution.
   */
  resolution: number
  /**
   * The raster's left and right edge.
   */
  edges: KernerEdges
}

export type KernerEdge = Array<number>

export type KernerEdges = {
  left: KernerEdge
  right: KernerEdge
}

export interface KernerOptions {
  writingMode?: WritingMode
  /**
   * The resolution in which the items will be rasterized.
   */
  resolution?: number
  /**
   * The space between two kerned items in px.
   */
  spacing?: number
  /**
   * Wether or not to show debugging information.
   */
  debug?: boolean
}

export interface Kerner extends KernerOptions {}

export class Kerner {
  isLeftToRight: boolean

  constructor({
    resolution = 10,
    spacing = 20,
    writingMode = 'left-to-right',
    debug = false
  }: KernerOptions = {}) {
    Object.assign(this, { resolution, spacing, writingMode, debug })
    this.isLeftToRight = writingMode === 'left-to-right'
  }

  /**
   * Get kerning information for the provided item.
   * @private
   * @param {paper.Item} item
   * @returns {KerningInfo}
   */
  _getKerningInfo(item: paper.Item): KerningInfo {
    // If stroke width ist too thin, some paths might get lost in rasterisation.
    // 1px width works with 72 dpi, so we increase the strokeWidth as the
    // resolution decreases.
    const { strokeWidth } = item
    const { resolution } = this
    item.strokeWidth = 72 / resolution

    const raster = item.rasterize({ resolution, insert: this.debug })
    item.strokeWidth = strokeWidth

    return {
      raster,
      edges: this._getEdges(raster),
      width: raster.width,
      height: raster.height,
      resolution: item.view.resolution
    }
  }

  /**
   * Place itemA next to itemB and move as close as possible without the two
   * items colliding. For performance reasons we use a raster instead of
   * paper.js' getIntersections method.
   * @param itemA The item to be kerned.
   * @param itemB The item to be kerned with.
   */
  kern(itemA: paper.Item, itemB: paper.Item) {
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
    // have to translate back to normal resolution.
    // Note: We're using 72(dpi) because we want to scale the minimal distance
    // value to screen density independent pixels, not to actually rendered pixels.
    const kerning = minDistance * (72 / resolution)
    // Apply kerning and spacing to the item.
    itemA.position.x += (kerning - this.spacing) * (isLeftToRight ? -1 : 1)

    if (this.debug) {
      // Align the raster with it's item.
      infoA.raster.bounds.topLeft = itemA.bounds.topLeft
    }
  }

  /**
   * Get left and right edge of the raster.
   * @private
   */
  _getEdges(raster: paper.Raster): KernerEdges {
    return {
      left: this._getEdge(raster, 'left'),
      right: this._getEdge(raster, 'right')
    }
  }

  /**
   * Find the left or right edge of the raster.
   * @private
   */
  _getEdge(raster: paper.Raster, side: 'left' | 'right') {
    const edge = []
    const { width, height } = raster
    const sideLeft = side === 'left'

    if (width && height) {
      // Loop through each row and check how much space (transparent pixels) is
      // there before a non-transparent pixel begins.
      const imageData = raster.getImageData(raster.bounds)
      for (let y = 0; y < height; y++) {
        for (let i = 0; i < width; i++) {
          const x = sideLeft ? i : width - 1 - i
          if (this._getPixelAlpha(imageData, x, y)) {
            edge[y] = sideLeft ? x : width - 1 - x
            this.debug &&
              raster.setPixel(x, y, new paper.Color(sideLeft ? 'red' : 'blue'))
            break
          }
        }
      }
    } else {
      // If paths got lost in rasterisation, resulting in a raster with zero
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
   */
  _getPixelAlpha(imageData: ImageData, x: number, y: number) {
    return imageData.data[(y * imageData.width + x) * 4 + 3]
  }
}
