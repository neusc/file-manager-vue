module.exports = {
  "publicPath": "./",
  "devServer": {
    "disableHostCheck": true,
    "proxy": "http://www.shechuan.me"
  },
  "configureWebpack": {
    "resolve": {
      "extensions": [
        ".js",
        ".vue",
        ".json"
      ],
      "alias": {
        "@": "/Users/chuans/personal/vultr-fe/file-manager/src"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}