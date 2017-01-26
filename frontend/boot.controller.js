'use strict';

/**
 * boot.controller.js
 * Entrypoint for controller-specific logic.
**/

var PIXI = require('pixi');
var Phaser = require('phaser');
var CONFIG = require('./js/config');

var States = {
    'Controller': require('./js/states/controller')
};

/**
 * Main app to bootstrap the controller.
**/
function Main() {
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
}

new Main();
