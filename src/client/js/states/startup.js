/**
 * startup.js
 * Initial state of the game when loaded.
 * Handles asset preloading, game setup, loader graphic, etc.
**/

var _common = require('./_common');
var BaseState = require('./_base');
var CONFIG = require('../config');
var Assets = require('../assets');



var StartupState = function(){
	BaseState.call(this);
};
StartupState.prototype = Object.create(BaseState.prototype);
StartupState.prototype.constructor = StartupState;

StartupState.prototype.preload = function() {
    BaseState.prototype.preload.call(this);

    var self = this;

    self.loaderText = self.add.text(
        self.game.width - 40,
        self.game.height - 40,
        '...',
        CONFIG.font.baseInterStyle);
    self.loaderText.anchor.setTo(1,1);

    setTimeout(function() {
        document.querySelector('canvas').classList.add('preloaded');
    }, 500);

    Assets.preload(self, function(progress, cacheKey, success, totalLoaded, totalFiles) {
        var updateText = progress.toString() + '% - LOADING...';
        self.loaderText.setText(updateText);

        if(totalLoaded === totalFiles) {
            console.log('All assets loaded');
            _common.delayedStateChange.call(self, 10, CONFIG.stateAfterStartup, true);
        }
    });
};

StartupState.prototype.create = function() {
	BaseState.prototype.create.call(this);

    // Add a wrapper to do fade transitions between states
    var state = this,
        game = this.game;

    game.goToState = function(stateName, isInstant) {
        if(isInstant) {
            game.state.start(stateName);
        } else {
            _common.fadeScreen.call(state, true, function() {
                game.state.start(stateName);
            });
        }
    };


};


module.exports = StartupState;