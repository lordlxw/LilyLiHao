'use strict'
require('./check-versions')()
// process.env.NODE_ENV = 'production'
//process.env.NODE_ENV = process.argv.splice(2)[0] == 'test' ? 'testing' : 'production'
if (process.env.NODE_ENV === 'testing') {
  console.log('正在编译 测试 环境')
} else if(process.env.NODE_ENV === 'development') {
  console.log('正在编译 开发 环境')
} else if(process.env.NODE_ENV === 'simulation') {
  console.log('正在编译 模拟 环境')
} else {
  console.log('正在编译 正式 环境')
}

const projectName = process.env.PROJECT_NAME
console.log('客户端:', projectName)

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
