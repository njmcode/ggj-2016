/**
 * title.js
 * State for the game title screen.
 * Shows a main graphic and a list of options (Start Game, Options, etc).
**/

var _common = require('./_common');
var BaseState = require('./_base');
var CONFIG = require('../config');

var UI = {
    HyperText: require('../ui/hypertext')
};

var TitleState = function(){
    BaseState.call(this);
};
TitleState.prototype = Object.create(BaseState.prototype);
TitleState.prototype.constructor = TitleState;


TitleState.prototype.create = function() {
    _common.addLabel.call(this, 'TITLE SCREEN');

    BaseState.prototype.create.call(this);
};

TitleState.prototype.update = function() {
};


module.exports = TitleState;