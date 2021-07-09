const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ImportPlugin = require('./import-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const TvjsRef = require('./tvjs-ref-plugin.js')

const webpack = require('webpack')
const path = require('path')

const VERS = require('../package.json').version
const DATE = new Date().toDateString()
const BANNER =

`TVJS Std Extension Pack - v${VERS} - ${DATE}\n` +
`    https://github.com/tvjsx/tvjs-xp\n` +
`    Copyright (c) 2020 c451 Code's All Right;\n` +
`    Licensed under the MIT license`

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        //library: 'TvjsXP',
        //libraryTarget: 'umd',
        //libraryExport: "default"
    },
    //performance: {
    //    maxEntrypointSize: 512000,
    //    maxAssetSize: 512000
    //},
    module: {
        rules: [{
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
		type: 'asset/resource',
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            include: /\.min\.js$/,
            extractComments: {
                banner: BANNER
            }
        })]
    },
    devtool: 'source-map',
    plugins: [
        new VueLoaderPlugin(),
        new webpack.BannerPlugin({
            banner: BANNER
        }),
        new TvjsRef(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //new ImportPlugin(  // why comment out this fix the script hang?
            //'http://localhost:8080/trading-vue.js',
            //'./node_modules/trading-vue-js/dist'
        //)
    ]
}
