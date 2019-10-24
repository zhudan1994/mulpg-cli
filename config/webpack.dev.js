const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
module.exports = merge(baseWebpackConfig, {
   mode: 'development',
   devtool: "eval-source-map", // 开启调试
   devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: {},
      hot: true,
      contentBase: path.join(__dirname, '../dist'),
      compress: true,
      host: HOST || '0.0.0.0',
      port: PORT || 8080,
      open: false,
      overlay: {
         errors: true,
         warnings: true
      },
      stats: {
         timings: true,
         modules: false,
         assets: true,
         entrypoints: false,
         assetsSort: 'field',
         builtAt: false,
         cached: false,
         cachedAssets: false,
         children: false,
         chunks: false,
         chunkGroups: false,
         chunkModules: false,
         chunkOrigins: false,
         performance: true,
         errors: true,
         warnings: true,
     }
   },
   plugins: [
      // 热更新插件
      new webpack.HotModuleReplacementPlugin(),
      // 压缩css
      new MiniCssExtractPlugin({
         filename: '[name].css',
         chunkFilename: '[name].css',
         ignoreOrder: true
      }),
      // 加入外链
      new AddAssetHtmlPlugin({
         filepath: path.resolve(__dirname, '../dll/vendor.dll.js'),
         hash: true
      })
   ]
})