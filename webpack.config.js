module.exports = {
  entry: {
    statusboard: './src/index.js',
  },
  output: {
    filename: './dist/index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx|.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?stage=0'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
