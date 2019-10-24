const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const plugins = require('./template')
const HappyPack = require('happypack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const baseConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    'app': './src/pages/app/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@':  path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: [
            'vue-style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader']
        }
      },
      {
        test: /\.(le|c)ss$/,
        use:[
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happy-babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
       cacheGroups:{
          priority: false,
          vendor: {
            chunks: "all", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
            test: /node_modules/, 
            name: "vendor",
            enforce: true,
          },
          common: { // 抽取公共模块
            chunks: "all", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
            minChunks: 2,
            name: "common",
            enforce: true,
            minSize: 0
          },
          styles: { // 用于提取js中的css到单独的js文件
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
            minSize: 0
          }
       }
    },
    minimizer: [
      // JS压缩
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      }),
      // css压缩
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // 引入外链
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/vendor.manifest.json')
    }),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happy-babel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    })
  ]
}
plugins.forEach((item) => {
  baseConfig.plugins.push(item)
})
module.exports = baseConfig