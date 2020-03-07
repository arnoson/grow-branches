import paper from 'paper'

export const loadSVG = (url, options) =>
  new Promise(resolve => {
    paper.project.importSVG(url, {
      ...options,
      onLoad: svg => resolve(svg)
    })
  })
