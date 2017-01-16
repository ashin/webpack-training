const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './app/index.js',
    ],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js',
    }
};
