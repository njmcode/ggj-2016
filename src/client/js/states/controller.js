/**
 * controller.js
 * State for the controller UI logic.
**/

var CONFIG = require('../config');
var IO = require('../io/controller-io');

var ControllerState = function(){};

var statusText, fireButton, shieldButton;

function _fireProjectile() {
	console.log('FIRE PROJECTILE');
	IO.socket.emit('gesture', {
		action: 'fire'
	});
}

function _doShield() {
	console.log('SHIELD');
	IO.socket.emit('gesture', {
		action: 'shield'
	});
}

ControllerState.prototype.preload = function() {
	this.load.image('icon-fire', '../public/assets/icon-fire.png');
	this.load.image('icon-shield', '../public/assets/icon-shield.png');
};

ControllerState.prototype.create = function() {
    console.log('CONTROLLER UI');
    
    // Add readout text for debugging
    statusText = this.add.text(10, 10, '', CONFIG.font.smallStyle);

    // Add fire and shield buttons
    fireButton = this.add.button(this.game.width * 0.5,
    	this.game.height * 0.25, 'icon-fire', _fireProjectile);
    fireButton.anchor.setTo(0.5, 0.5);

    shieldButton = this.add.button(this.game.width * 0.5,
    	this.game.height * 0.75, 'icon-shield', _doShield);
    shieldButton.anchor.setTo(0.5, 0.5);

    // Receive gesture events
    IO.socket.on('gesture', function(data) {
    	if(statusText && data.action) statusText.setText('Action: ' + data.action);
    });
};

ControllerState.prototype.update = function() {

};


module.exports = ControllerState;