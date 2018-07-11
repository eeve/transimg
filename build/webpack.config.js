import webpack from 'webpack'
import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import plugins from './plugins'

const isProd = process.env.NODE_ENV === 'production'
const resolve = (dir) => {
  return path.resolve(__dirname, '..', dir)
}

let entry = {
  content: './content/index',
  popup: './popup/index',
  background: './background/index'
}
if (!isProd) {
  entry.hot = './hot'
}

export default {
  context: resolve('app'),
  mode: process.env.NODE_ENV,
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  entry: entry,
  output: {
    path: resolve('dist'),
    publicPath: '/',
    jsonpFunction: 'TRANSIMG',
    library: '$transimg',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.less'],
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: isProd ? [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { minimize: true }
          },
          'less-loader'
        ] : ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(gif|jpg|png|eot|ttf|woff|woff2|svg)$/,
        use: 'url-loader?limit=5000&name=[hash:6].[ext]'
      },
      {
        test: /\.(txt)$/,
        use: 'raw-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        lib: {
          chunks: 'initial',
          test: 'lib',
          name: 'lib',
          enforce: true
        }
      }
    }
  },
  plugins: plugins.concat(
    isProd
      ? [
        new MiniCssExtractPlugin({
          filename: 'app.[chunkhash].css'
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        })
      ]
      : [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin()
      ]
  ),
  devServer: {
    hot: true,
    quiet: false,
    inline: true,
    compress: true,
    contentBase: 'dist',
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    port: 2000
  }
}
