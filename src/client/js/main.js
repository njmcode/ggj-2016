/**
 * main.js
 * Main application. Creates a new Phaser.Game
 * and adds the different game states to it,
 * then kicks off the Startup state.
**/


var CONFIG = require('./config');

/**
 * References for the various state modules in our
 * game.  Added to the game inside Main().
**/
var States = {
    Startup: require('./states/startup'),
    Title: require('./states/title'),
    Play: require('./states/play'),
    GameOver: require('./states/gameover')
};

var GameState = require('./gamestate/index');


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

    // Add the internal gamestate tracking objects
    game.gameState = GameState;

    // Add our states to the game
    for(var k in States) {
        game.state.add(k, States[k]);
    }

    // Trigger the startup state immediately
    game.state.start('Startup');
};

module.exports = Main;