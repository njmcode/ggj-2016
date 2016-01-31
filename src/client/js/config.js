/**
 * config.js
 * Configuration object that gets passed around the app
 * for convenience.
**/

var CONFIG = {

    debug: {
        enabled: false,
    },

    //stateAfterStartup: 'Title',
    stateAfterStartup: 'PlayField',

    // Pixel size of the Phaser canvas.
    // (Canvas itself is scaled to viewport)
    gameSize: {
        width: 800,
        height: 400
    },

    // Pixel size of the controller's Phaser canvas.
    controllerGameSize: {
        width: 400,
        height: 800
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