/**
 * config.js
 * Configuration object that gets passed around the app
 * for convenience.
**/

var CONFIG = {

    debug: {
        enabled: false,
    },

    // Pixel size of the Phaser canvas.
    // (Canvas itself is scaled to viewport)
    gameSize: {
        width: 1600,
        height: 1068
    },

    // Pixel size of the controller's Phaser canvas.
    controllerGameSize: {
        width: 500,
        height: 500
    },

    // Font style definitions
    font: {
        // Generic/default text
        baseStyle: {
            font: '46px arial',
            fill: '#caa',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        },

        smallStyle: {
            font: '18px arial',
            fill: '#666',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        }
    },

};

module.exports = CONFIG;