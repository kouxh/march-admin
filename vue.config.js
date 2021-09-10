const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}



const name = '元家军小程序后台'
module.exports = {
  // hash 模式下可使用
  // publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  // 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
  publicPath: './',//基本路径
  outputDir: 'dist',// 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  assetsDir: 'static',//放置静态资源的目录
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,//生产环境是否生成 sourceMap 文件,可以将其设置为 false 以加速生产环境构建
  devServer: {// 环境配置
    host: 'localhost',
    port: 8080,
    open: true, //配置自动启动浏览器
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {// 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
    //   '/march': {
    //     target: 'https://war.yuanian.com',
    //     changeOrigin: true,
    //     pathRewrite: { '^': '' },
    //   },
    // }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)
    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', config =>
      config.devtool('cheap-source-map')
    )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: path.resolve(__dirname, 'src/components'),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })

    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  css: {
    extract: true,// 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false,// 开启 CSS source maps
    requireModuleExtension: true,
    // modules: false,// 启用 CSS modules for all css / pre-processor files.
    // css预设器配置项
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },


  pluginOptions: {// 第三方插件配置
    // ...
  }
}
