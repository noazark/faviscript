const fs = require('fs')
const path = require('path')
const { createCanvas } = require('canvas')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

module.exports = function (config, func) {
  const {outputPath, sizes} = config

  return Promise.all(sizes.map(({width, height}) => {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    func(canvas, ctx)

    return writeFile(path.join(outputPath, `icon-${width}-${height}.png`), canvas.toBuffer());
  }))
}
