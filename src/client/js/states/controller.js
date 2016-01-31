/**
 * controller.js
 * State for the controller UI logic.
**/

var CONFIG = require('../config');
var gestureEngine = require('../ui/gestures');

var statusText, fireButton, shieldButton;

var socket, gameID, playerData = {};

function _setupSocket() {
    socket = io.connect();
    gameID = window._game;
}

function _fireProjectile() {
	console.log('FIRE PROJECTILE');
	socket.emit('gesture', {
		action: 'fire',
        position: playerData.position
	});
}

function _doShield() {
	console.log('SHIELD');
	socket.emit('gesture', {
		action: 'shield',
        position: playerData.position
	});
}

function _onGestureDetect(gestureName) {
    console.log('gesture detected', gestureName);
}

function _onGestureFail() {
    console.log('gesture failed');
}

var ControllerState = function(){};

ControllerState.prototype.preload = function() {
	this.load.image('icon-fire', '../public/assets/icon-fire.png');
	this.load.image('icon-shield', '../public/assets/icon-shield.png');
};

ControllerState.prototype.create = function() {
    console.log('CONTROLLER UI');

    _setupSocket();
    gestureEngine.init(this, this.game.canvas, {
        success: _onGestureDetect,
        fail: _onGestureFail
    });

    console.log('Game is', gameID);
    
    // Add readout text for debugging
    statusText = this.add.text(10, 10, '', CONFIG.font.smallStyle);

    // Add fire and shield buttons
    /*fireButton = this.add.button(this.game.width * 0.5,
    	this.game.height * 0.25, 'icon-fire', _fireProjectile);
    fireButton.anchor.setTo(0.5, 0.5);

    shieldButton = this.add.button(this.game.width * 0.5,
    	this.game.height * 0.75, 'icon-shield', _doShield);
    shieldButton.anchor.setTo(0.5, 0.5);*/

    // Connect event
    socket.on('connect', function() {

        var data = {
            game: gameID
        };
        if (window.location.hash) {
            data.id = window.location.hash;
        }
        socket.emit('join', data);
        console.log('Controller received CONNECT', data);
    });

    
    socket.on('join', function(data) {
        console.log('Controller received JOIN', data);
        window.location.hash = data.id;
        for (var k in data) {
            playerData[k] = data[k];
        }
    });

    // Receive gesture events
    socket.on('gesture', function(data) {
        console.log('Controller received GESTURE', data);
    	if(statusText && data.action) statusText.setText('Action: ' + data.action);
    });
};

ControllerState.prototype.update = function() {

};


module.exports = ControllerState;