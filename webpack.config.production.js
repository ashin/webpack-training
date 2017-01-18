const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const appPaths = [
  path.resolve(__dirname, 'app'),
];

module.exports = {
    entry: [
        './app/index.js',
    ],
    output: {
        publicPath: '/dist',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: appPaths,
            },
            {
                test: /\.(gif|jpg|jpeg|png)$/,
                loader: 'url-loader?limit=10000&name=images/[hash:8].[ext]',
                include: appPaths,
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[emoji]',
                    'postcss-loader'
                ],
                include: appPaths,
            },
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
    ],
    postcss: [
        autoprefixer
    ],
};
