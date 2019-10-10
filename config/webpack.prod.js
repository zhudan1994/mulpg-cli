const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
   mode: 'production',
   output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js'
   },
   plugins: [
      // 清除dist目录
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
         filename: 'css/[name].css',
         chunkFilename: 'css/[name].css',
         ignoreOrder: true
      }),
      new AddAssetHtmlPlugin({ // 改插件必须放在HtmlWebpackPlugin之后
         filepath: path.resolve(__dirname, '../dll/vendor.dll.js'),
         hash: true,
         publicPath: 'js', // HTML文件中路径显示
         outputPath: 'js' // 相对html文件的路径配置 
      })
   ]
})