const config = require('../config/webpack.dev.config.js');
const WebpackDevServer = require("webpack-dev-server")
const webpack = require("webpack");

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");

var compiler = webpack(config);



var server = new WebpackDevServer(compiler, {
    hot:true,
    host: "10.1.110.51"
})
server.listen(8080)
