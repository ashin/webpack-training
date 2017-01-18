const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');
const port = 3000;

new WebpackDevServer(webpack(config), {
    contentBase: '/dist',
    filename: config.output.filename,
    hot: true,
    historyApiFallback: true
}).listen(port, 'localhost', error => {
    if (error) {
        console.log(error);
    }
});
