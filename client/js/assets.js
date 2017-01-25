'use strict';

/**
 * assets.js
 * List of required project assets and some simple logic
 * for preloading them in Phaser.
 * Used during the Startup state to preload and report on all
 * required assets - we do this upfront to prevent pauses/delays
 * during the game.
**/

var CONFIG = require('./config');

// Object list of assets to preload
var assets = {

    // ui, scenes and images are standard image files.
    // Format is [key, path]
    images: [
        'icon-fire',
        'icon-shield',
        'logo',
        'starfield',
        'layer1',
        'layer2',
        'layer3',
        'clouds',
        'dusk-mask',
        'vignette',
        'empty',
        'spell-shot',
        'spell-shield'
    ],
    // Audio files to load
    audio: [
        'title-theme',
        'bgm',
        'collide1',
        'collide2',
        'collide3',
        'collide4',
        'shield-collide1',
        'shield-collide2',
        'shield-collide3',
        'shield-collide4',
        'shield1',
        'shield2',
        'shield3',
        'shield4',
        'shot1',
        'shot2',
        'shot3',
        'shot4'
    ]
};

/**
 * Calls Phaser's load functions on the assets list and fires a callback
 * when each one completes.
 * @param game - reference to Phaser.Game instance
 * @param fileLoadedCallback - function to fire when *each* file loads
**/
function preloadAssets(game, fileLoadedCallback) {

    game.load.onFileComplete.add(fileLoadedCallback, this);

    console.log('Preloading images...');
    assets.images.forEach(function(item) {
        game.load.image(
            item,
            CONFIG.assetsPath + 'images/' + item + '.png'
        );
    });

    console.log('Preloading audio...');
    assets.audio.forEach(function(item) {
        game.load.audio(
            item,
            [
                CONFIG.assetsPath + 'audio/' + item + '.mp3',
                CONFIG.assetsPath + 'audio/' + item + '.opus'
            ]
        );
    });

    game.load.start();

}

module.exports = {
    assets: assets,
    preload: preloadAssets
};
