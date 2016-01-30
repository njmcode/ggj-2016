/**
 * _base.js
 * Base class for all game States to inherit from.
 * Handles some common setup/teardown stuff e.g. crossfading,
 * play area scaling, cursor creation, etc.
**/

var _common = require('./_common');


function BaseState() {}

BaseState.prototype.init = function(params) {

};

BaseState.prototype.preload = function() {

};

BaseState.prototype.create = function() {

};

module.exports = BaseState;