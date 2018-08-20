var path = require('path');
var webpack=require("webpack");
module.exports = {
  devtool: 'source-map',
  cache: false,
  mode: "development",
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /psd\.min\.js$/,
      //   use: "script-loader"
      // },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname + '/src'),
      path.resolve(__dirname + '/node_modules')
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  plugins:[
    new webpack.EnvironmentPlugin(['INTERACTIVE'])
  ],
  watch: true
};