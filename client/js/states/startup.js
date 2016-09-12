'use strict';

/**
 * startup.js
 * Initial state of the game when loaded.
 * Handles asset preloading, game setup, loader graphic, etc.
**/
var Assets = require('../assets');
var CONFIG = require('../config');
var _common = require('./_common');

var StartupState = function() {
};


StartupState.prototype.preload = function() {
    _common.setGameScale(this.game);

    var self = this;

    self.loaderText = self.add.text(
        self.game.width - 40,
        self.game.height - 40,
        '...',
        CONFIG.font.smallStyle);
    self.loaderText.anchor.setTo(1,1);

    Assets.preload(self, function(progress, cacheKey, success, totalLoaded, totalFiles) {
        console.log('preload', progress, cacheKey, totalLoaded, totalFiles);

        var updateText = progress.toString() + '% - LOADING...';
        self.loaderText.setText(updateText);
    });

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
};

StartupState.prototype.create = function() {
    var self = this;
    _common.socket = io.connect();
    _common.socket.on('connect', function() {
        console.log('connect', window.game);
        if (window.location.hash) {
            self.game.state.start(window.location.hash.substr(1));
        } else {
            self.game.state.start(CONFIG.stateAfterStartup);
        }
    });
};


module.exports = StartupState;
