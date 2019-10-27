module.exports = {
  publicPath: '',
  outputDir: 'www',
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
