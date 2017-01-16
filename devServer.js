const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');
const opn = require('opn');
const port = 3000;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    filename: config.output.filename,
    hot: true,
    historyApiFallback: true
}).listen(port, 'localhost', error => {
    if (error) {
        console.log(error);
    } else {
        opn(`http://localhost:${port}`);
    }
});
