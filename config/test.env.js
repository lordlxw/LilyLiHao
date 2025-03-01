'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  // BASE_API: '"http://192.168.139.66:8080"'
  BASE_API: '"https://apitest.quants.top"',
  WS_URL: '"wss://apitest.quants.top/websocket"'
})
