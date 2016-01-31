/**
 * config.js
 * Configuration object that gets passed around the app
 * for convenience.
**/

var CONFIG = {

    debug: {
        enabled: false,
    },

    stateAfterStartup: 'Title',

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
            font: '24px VT323',
            fill: '#caa',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        },

        smallStyle: {
            font: '18px VT323',
            fill: '#c8a',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        }
    },

    // Game settings
    settings: {
        health: {
            base: 20,
            max: 100
        },
        mana: {
            base: 10,
            max: 15,
            regen: 1  // How often (secs) mana is incremented by 1
        },
        manaCost: {
            shot: 1,
            shield: 1,
            standard: 0,  // Standard attacks have no extra cost
            wind: 2,
            earth: 2,
            fire: 2,
            water: 2,
            powerMultiplier: 2  // How much cost is multiplied by for a power manoevure
        },
        spells: {
            shotBaseSpeed: 120,
            shotDamage: 10,
            shieldLength: 2     // Time in seconds
        },
        timeLimit: 99
    }

};

module.exports = CONFIG;
