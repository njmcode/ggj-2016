
var CONFIG = require('../config');

var Wizard = function(state) {
	// Inherit from Phaser's Sprite class
    Phaser.Sprite.call(this, state.game, 0, 0, 's-wizard', 0);

    // Set anchor point so the pointer finger of the graphic matches
    // that of the regular cursor
    this.anchor.setTo(0.5, 1);
    this.game = state.game;
};

Wizard.prototype = Object.create(Phaser.Sprite.prototype);
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function() {

};

module.exports = Wizard;

