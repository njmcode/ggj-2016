'use strict';

var path = require('path');
var webpack = require('webpack');

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');

module.exports = {
    entry: {
        'main': './boot.js',
        'controller': './boot.controller.js'
    },
    output: {
        path: '../static/',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                sequences: true,
                properties: false,
                dead_code: true,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: true
            },
            output: {
            },
            comments: false,
        })
    ],
    module: {
        loaders: [
            { test: /pixi\.js/, loader: 'expose?PIXI' },
            { test: /phaser-arcade-physics\.js$/, loader: 'expose?Phaser' }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi
        }
    }
};
