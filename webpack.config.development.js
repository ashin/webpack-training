const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appPaths = [
  path.resolve(__dirname, 'app'),
];

module.exports = {
    entry: [
        './app/index.js',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/dev-server',
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
                    'css-loader?modules&localIdentName=[name]__[local]___[emoji]',
                    'postcss-loader'
                ],
                include: appPaths,
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
    	})
    ],
    postcss: [
        autoprefixer
    ],
};
