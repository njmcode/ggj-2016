'use strict';

var webpack = require("webpack");

module.exports = {
    entry: {
        'main': './boot.js',
        'controller': './boot.controller.js'
    },
    output: {
        path: '../server/public/',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                drop_console: true
            }
        })
    ]
};
