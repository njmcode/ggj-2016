/**
 * play.js
 * State for the primary in-game experience.
 * Displays and manages UI, current room, game logic, ambient FX,
 * sequencing/scripting, etc.
**/

var _common = require('./_common');
var BaseState = require('./_base');
var CONFIG = require('../config');

var PlayState = function(){
    BaseState.call(this);
};
PlayState.prototype = Object.create(BaseState.prototype);
PlayState.prototype.constructor = PlayState;

PlayState.prototype.create = function() {
    _common.addLabel.call(this, 'PLAYING');

    BaseState.prototype.create.call(this);
};

module.exports = PlayState;
