const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    library: 'Pexe',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: 'pexe.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};