/**
 * startup.js
 * Initial state of the game when loaded.
 * Handles asset preloading, game setup, loader graphic, etc.
**/
var Assets = require('../assets');
var CONFIG = require('../config');

var StartupState = function(){
};


StartupState.prototype.preload = function() {

    var self = this;

    self.loaderText = self.add.text(
        self.game.width - 40,
        self.game.height - 40,
        '...',
        CONFIG.font.baseStyle);
    self.loaderText.anchor.setTo(1,1);

    Assets.preload(self, function(progress, cacheKey, success, totalLoaded, totalFiles) {
        var updateText = progress.toString() + '% - LOADING...';
        self.loaderText.setText(updateText);

        if(totalLoaded === totalFiles) {
            console.log('All assets loaded');
            game.state.start('title');
        }
    });
};

StartupState.prototype.create = function() {

};


module.exports = StartupState;