const path = require('path')

module.exports = {
  mode: 'development',
  entry: './dev/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dev')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dev'),
    port: 8080
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset/resource'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
