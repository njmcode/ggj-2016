'use strict';

var webpack = require("webpack");

module.exports = {
    entry: {
        'main': './boot.js'
    },
    output: {
        path: __dirname,
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};
