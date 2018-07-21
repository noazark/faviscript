#!/usr/bin/env node

"use strict"

const faviscript = require('./')
const path = require('path')

const configPath = path.join(process.cwd(), '.faviscript.json')
const config = require(configPath)
const {scriptPath, outputPath} = config
const funcPath = path.join(process.cwd(), scriptPath || 'faviscript.js')
const func = require(funcPath)

const SIZE_PATTERN = /^(\d+)(?:x(\d+))?$/

const sizes = config.sizes.map((size) => {
  const _size = size.match(SIZE_PATTERN)

  const width = parseInt(_size[1], 10)
  const height = _size[2] ? parseInt(_size[2], 10) : width

  return {width, height}
})

faviscript({outputPath, sizes}, func)
