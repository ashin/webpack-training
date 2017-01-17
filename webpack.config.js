const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const appPaths = [
  path.resolve(__dirname, 'app')
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
        new webpack.optimize.UglifyJsPlugin()
    ]
    : [
        new webpack.HotModuleReplacementPlugin(),
    ];

const themes = {
    default: 'themes/default',
    crazy: 'themes/crazy',
};
const selectedTheme = themes[process.env.THEME] || themes.default;


module.exports = {
    entry: entry,
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
            {
                test: /\.(gif|jpg|jpeg|png)$/,
                loader: 'url-loader?limit=10000&name=images/[hash:8].[ext]',
                include: appPaths,
            },
            {
                test: /\.(css|less)$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[name]__[local]___[emoji]',
                    'postcss-loader',
                    'less-loader',
                ],
                include: appPaths,
            }
        ],
    },
    plugins: plugins,
    postcss: [
        autoprefixer
    ],
    resolve: {
        modulesDirectories: ['node_modules', selectedTheme]
    },
};
