const path = require('path');
const webpack = require('webpack');

const appPaths = [
  path.resolve(__dirname, 'app'),
];

module.exports = {
    entry: [
        './app/index.js',
    ],
    output: {
        publicPath: '/dist/',
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: appPaths,
            },
        ],
    }
};
