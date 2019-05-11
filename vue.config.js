module.exports = {
  publicPath: '',
  configureWebpack: {
    devtool: 'source-map'
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss/base.scss";'
      }
    }
  }
}
