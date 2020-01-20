const title = '华粹'
const path = require('path')
const PROXY_HOST = require('./public/config.js')
function resolve (dir) {
  // 路径可能与你的项目不同
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: false,
  productionSourceMap: false,
  integrity: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/styles/element-variables.scss";`
      }
    }
  },
  devServer: {
    open: true,
    proxy: PROXY_HOST.proxy,
    /* proxy: {
      '/': {
        target: 'http://192.168.1.48:8090', // 目标主机
        ws: false,
        changOrigin: true
      }
    }, */
    before: app => {
    }
  },
  configureWebpack: {
    name: title
  },
  chainWebpack: (config) => {
    config.module.rule('svg')
      .exclude.add(resolve('src/icons'))

    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons')).end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' }).end()
  }
}
