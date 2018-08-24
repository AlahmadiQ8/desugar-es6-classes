const path = require('path')

module.exports = {
  mode: 'production',
  node: {
    fs: 'empty',
  },
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'desugarClasses',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env'] },
          },
        ],
      },
    ],
  },
}
