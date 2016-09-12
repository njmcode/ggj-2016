/**
 * boot.controller.js
 * Entrypoint for controller-specific logic.
**/

/*
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./sw.js')
           .then(function() { console.log("ServiceWorker registered"); });
}
*/

var CONFIG = require('./js/config');

var States = {
    'Controller': require('./js/states/controller')
};

/**
 * Main app to bootstrap the controller.
**/
function Main(){
    // Create a new game
    var game = new Phaser.Game(
        CONFIG.controllerGameSize.width,
        CONFIG.controllerGameSize.height,
        Phaser.AUTO
    );

    for(var k in States) {
        game.state.add(k, States[k]);
    }

    game.state.start('Controller');
};

Main();
