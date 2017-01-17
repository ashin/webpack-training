const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appPaths = [
  path.resolve(__dirname, 'app'),
];
const isProduction = process.env.NODE_ENV === 'production';

const entry = isProduction
    ? [
        './app/index.js',
    ]
    : [
        './app/index.js',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/dev-server',
    ];

const plugins = isProduction
    ? [
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: 'ejs!app/index.ejs'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
    	})
    ]
    : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
    	})
    ];

const cssLoader = isProduction
    ? {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
            'style-loader',
            'css-loader?modules&localIdentName=[emoji]',
            'postcss-loader'
        ),
        include: appPaths,
    }
    : {
        test: /\.css$/,
        loaders: [
            'style-loader',
            'css-loader?modules&localIdentName=[name]__[local]___[emoji]',
            'postcss-loader'
        ],
        include: appPaths,
    };

module.exports = {
    entry: entry,
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
            cssLoader,
        ],
    },
    plugins: plugins,
    postcss: [
        autoprefixer
    ],
};
