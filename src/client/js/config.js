/**
 * config.js
 * Configuration object that gets passed around the app
 * for convenience.
**/

var CONFIG = {

    debug: {
        enabled: false,
        showCursorPos: true,
        showInteractions: true
    },

    // Pixel size of the Phaser canvas.
    // (Canvas itself is scaled to viewport)
    gameSize: {
        width: 1600,
        height: 1068
    },

    // Which state to load once Startup state completes.
    stateAfterStartup: 'Title',

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

// version of the default font for menu
CONFIG.font.baseMenuStyle = Object.create(CONFIG.font.baseStyle);
CONFIG.font.baseMenuStyle.font = '62px arial',
CONFIG.font.baseMenuStyle.fill = '#ccc';


module.exports = CONFIG;