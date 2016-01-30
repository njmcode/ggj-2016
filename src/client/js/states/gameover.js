/**
 * gameover.js
 * State for the player death screen.
 * Shows a death graphic and messaging, then proceeds to the Title state
 * after a delay.
**/

var _common = require('./_common');
var BaseState = require('./_base');


var GameOverState = function(){
	BaseState.call(this);
};
GameOverState.prototype = Object.create(BaseState.prototype);
GameOverState.prototype.constructor = GameOverState;

GameOverState.prototype.create = function() {
    _common.addLabel.call(this, 'GAME OVER...');
    _common.delayedStateChange.call(this, 3000, 'Title');

    BaseState.prototype.create.call(this);
};


module.exports = GameOverState;