//webpack.dll.conf.js

const path = require('path')
const webpack = require('webpack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 将动态链接库放到/dist/dll/下
module.exports = {
  mode: 'production',
  entry: {
    vendor: [
      'vue/dist/vue.esm.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      // 生成映射文件
      path: path.resolve(__dirname, '../dll/[name].manifest.json'),
      name: '[name]_library',
    }),
    // 压缩缓存
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false
        }
      }
    })
  ]
}
