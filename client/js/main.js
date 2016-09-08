/**
 * main.js
**/

var CONFIG = require('./config');

var States = {
    'Startup': require('./states/startup'),
    'Title': require('./states/title'),
    'PlayField': require('./states/playfield')
};

/**
 * Main app. Little more than a bootstrap - the
 * game logic resides in the various states.
**/
function Main(){
    // Create a new game
    var game = new Phaser.Game(
        CONFIG.gameSize.width,
        CONFIG.gameSize.height,
        Phaser.AUTO
    );

    for(var k in States) {
        game.state.add(k, States[k]);
    }


    game.state.start('Startup');
};

module.exports = Main;