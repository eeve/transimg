import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const isProd = process.env.NODE_ENV === 'production'

export default [
  new HtmlWebpackPlugin({
    chunks: ['popup'],
    filename: 'popup.html',
    template: 'popup/index.html'
  }),
  new CopyWebpackPlugin([
    {
      from: 'icon.png',
      to: 'icon.png'
    }
  ]),
  new ManifestPlugin({
    writeToFileEmit: true,
    seed: {
      'manifest_version': 2,
      'name': '上传到图床',
      'version': '1.0',
      'description': '将图片上传到图床，得到图床的图片地址',
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
        '16': 'icon.png',
        '48': 'icon.png',
        '128': 'icon.png'
      },
      'browser_action': {
        'default_icon': {
          '19': 'icon.png',
          '38': 'icon.png',
          '128': 'icon.png'
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
