module.exports = {
  entry: {
    commanderpage: "./js/commanderpage.js",
    adsearchpage: "./js/advancedcardsearchpage.js",
    searchpage: "./js/cardsearchpage.js",
    deckpage: "./js/decklistpage.js",
    login: "./js/loginpage.js"
  },
  devtool: "source-map",
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, exclude: /node_modules/, loader: 'url-loader?limit=100000' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(png|jpg)$/, loader: 'file-loader' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader' }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  }
};
