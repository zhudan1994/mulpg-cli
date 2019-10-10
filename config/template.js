const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseDir = path.resolve(__dirname, '../src/pages')
const arr = []
const excludeDir = ['index']
// 取到所有页面，目录名称
const viewArr = fs.readdirSync(baseDir).filter(dir => {
  return excludeDir.indexOf(dir) === -1 && fs.statSync(baseDir + '/' + dir).isDirectory()
})

// 页面标题
const titleArr = {
  'app': 'app'
}

viewArr.forEach(dir => {
  // 入口文件
  const enrtyFile = dir + '.js'
      // 模板文件名称，
  const filename = dir + '/' + dir + '.html'
  arr.push(new HtmlWebpackPlugin({
      title: titleArr[`${dir}`],
      //入口名称
      entryName: dir,
      inject: true,
      // 打包生成的模板名称，如果filename包含路径信息会创建对应的路径
      filename: `${dir}.html`,
      //html模板的路径
      template: 'index.html',
      chunks: ['vendor', 'common', 'styles', dir],
      favicon: path.resolve('favicon.ico'),
      chunksSortMode: 'dependency',
      hash: true
  }))
})

module.exports = arr