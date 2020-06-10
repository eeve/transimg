import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

const isProd = process.env.NODE_ENV === 'production'

export default [
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    chunks: ['popup'],
    filename: 'popup.html',
    template: 'popup/index.html'
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'icons/',
        to: 'icons/'
      }
    ]
  }),
  new ManifestPlugin({
    writeToFileEmit: true,
    seed: {
      'manifest_version': 2,
      'name': '上传到图床',
      'short_name': 'transimg',
      'version': '1.0.0',
      'description': '右键将网页上的图片直接上传到图床，并得到图床的图片地址。简单、快速、好用，现支持微博和sm.ms图床。',
      'author': 'eeve',
      'homepage_url': 'https://eeve.me',
      'background': {
        'scripts': isProd ? [
          'background.js'
        ] : [
          'hot.js',
          'background.js'
        ],
        'persistent': false
      },
      'permissions': [
        'http://*/*',
        'https://*/*',
        'storage',
        'contextMenus',
        'clipboardWrite',
        'clipboardRead'
      ],
      'icons': {
        '16': './icons/icon16.png',
        '32': './icons/icon32.png',
        '48': './icons/icon48.png',
        '128': './icons/icon128.png'
      },
      'browser_action': {
        'default_icon': {
          '16': './icons/icon16.png',
          '32': './icons/icon32.png',
          '48': './icons/icon48.png',
          '128': './icons/icon128.png'
        },
        'default_title': '上传到图床',
        'default_popup': 'popup.html'
      },
      'content_scripts': [
        {
          'matches': ['http://*/*', 'https://*/*'],
          'js': ['content.js']
        }
      ],
      'content_security_policy': "script-src 'self' 'unsafe-eval'; object-src 'self'"
    },
    filter: (info) => {
      return false
    }
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
]
