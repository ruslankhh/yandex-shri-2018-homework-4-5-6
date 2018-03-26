const path = require('path');

module.exports = {
  entry: './src/scripts/main.js',
  output: {
    path: path.resolve(__dirname, 'public/scripts'),
    filename: 'build.js'
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
