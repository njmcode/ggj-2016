/**
 * _common.js
 * Some helper functions used across multiple states.
 * All expect to be called in the context of a state instance
 * i.e. _doGameScale.call(<state instance>)
**/

var CONFIG = require('../config');

// Force the Phaser canvas to scale to the viewport,
// preserving aspect ratio.
function _doGameScale() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
}

// Display a text label in the center of the screen.
// Debug purposes only, really.
// @param text - string to display
// @return label - text instance created
function _addLabel(text) {
    var label = this.add.text(this.game.width * 0.5, this.game.height * 0.5, text, CONFIG.font.baseStyle);
    label.anchor.setTo(0.5);
    return label;
}

// Wait a set time then change the game state.
// @param delay - time in ms to wait
// @param stateName - string id of state to change to (see main.js)
function _delayedStateChange(delay, stateName, noFade) {
    this.game.time.events.add(delay, function() {
        this.game.goToState(stateName, noFade);
    }, this);
}

// Fade the screen to/from black and fire a callback after
// @param toBlack - boolean, if true screen will fade out, otherwise in
// @param callback - optional function to call when fade completes
function _fadeScreen(toBlack, callback) {

    this.game.screenFader = this.game.add.graphics(0, 0);
    this.game.screenFader.beginFill(0x000000);
    this.game.screenFader.drawRect(0, 0, this.game.width, this.game.height);
    this.game.screenFader.alpha = 0;
    this.game.screenFader.blendMode = Phaser.blendModes.DIFFERENCE;

    this.game.screenFader.alpha = toBlack ? 0 : 1;
    this.game.world.bringToTop(this.game.screenFader);
    if(this.cursor) this.cursor.bringToTop();

    var tw = this.game.add.tween(this.game.screenFader);
    tw.to({ alpha: (toBlack ? 1 : 0) }, CONFIG.stateFadeTime, null);
    tw.onComplete.add(function() {
        if(callback) callback.call(this.game);
    }, this);
    tw.start();
}

module.exports = {
    doGameScale: _doGameScale,
    addLabel: _addLabel,
    delayedStateChange: _delayedStateChange,
    fadeScreen: _fadeScreen
};