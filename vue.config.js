const path = require('path')
const publicPath = process.env.NODE_ENV === 'production' ? 'http://www.shechuan.me/filemanager/' : './'
module.exports = {
  publicPath,
  devServer: {
    disableHostCheck: true,
    proxy: 'http://www.shechuan.me'
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
}
