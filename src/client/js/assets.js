/**
 * assets.js
 * List of required project assets and some simple logic
 * for preloading them in Phaser.
 * Used during the Startup state to preload and report on all
 * required assets - we do this upfront to prevent pauses/delays
 * during the game.
**/

// Object list of assets to preload
var assets = {

    // ui, scenes and images are standard image files.
    // Format is [key, path, width, height]
    ui: [
        ['icon-fire', 'public/assets/icon-fire.png', 128, 128],
        ['icon-shield', 'public/assets/icon-shield.png', 128, 128],
        ['title-logo', '/public/assets/title/logo.png', 480, 81],
        ['starfield', '/public/assets/title/starfield.png', 800, 400],
        ['layer1', '/public/assets/title/layer1.png', 800, 400],
        ['layer2', '/public/assets/title/layer2.png', 800, 400],
        ['layer3', '/public/assets/title/layer3.png', 800, 400],
        ['clouds', '/public/assets/title/clouds.png', 800, 400],
        ['dusk-mask', '/public/assets/title/dusk_mask.png', 800, 400],
        ['vignette', '/public/assets/title/vignette.png', 800, 400]
    ],
    // Format is [key, path, width, height]
    images: [
        ['s-wizard', 'public/assets/wizard.png', 128, 128]
    ],
    // Audio files to load
    sounds: [
        /*[
            'title-intro',
            [
                'static/assets/sounds/escape.mp3',
                'static/assets/sounds/escape.opus'
            ]
        ],*/
    ],
    bgm: [
        /*['title',
            [
                'static/assets/bgm/title.mp3', 'static/assets/bgm/title.opus'
            ]
        ],*/
    ]
};

/**
 * Calls Phaser's load functions on the assets list and fires a callback
 * when each one completes.
 * @param game - reference to Phaser.Game instance
 * @param fileLoadedCallback - function to fire when *each* file loads
**/
function preloadAssets(game, fileLoadedCallback){

    game.load.onFileComplete.add(fileLoadedCallback, this);

    console.log('Preloading ui...');
    assets.ui.forEach(function(item) {
        game.load.image(item[0], item[1], item[2], item[3]);
    });

    console.log('Preloading images...');
    assets.images.forEach(function(item) {
        game.load.image(item[0], item[1], item[2], item[3]);
    });

    console.log('Preloading bgm...');
    assets.bgm.forEach(function(item) {
        game.load.audio(item[0], item[1]);
    });

    console.log('Preloading sounds...');
    assets.sounds.forEach(function(item) {
        game.load.audio(item[0], item[1]);
    });

    game.load.start();

};

module.exports = {
    assets: assets,
    preload: preloadAssets
};