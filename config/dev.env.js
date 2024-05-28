'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://frp.cd-hst.com:18082"'
  BASE_API: '"https://apitest.quants.top"',
  WS_URL: '"wss://apitest.quants.top/websocket"'
})
