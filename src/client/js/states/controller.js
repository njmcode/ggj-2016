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

function _bindControls() {
    // Add readout text for debugging
    statusText = this.add.text(10, 10, '', CONFIG.font.smallStyle);
}

var ControllerState = function(){};

ControllerState.prototype.preload = function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

	this.load.image('icon-fire', '../public/assets/icon-fire.png');
	this.load.image('icon-shield', '../public/assets/icon-shield.png');
};

ControllerState.prototype.create = function() {
    console.log('CONTROLLER UI');

    _setupSocket();
    _bindControls.call(this);
    
    gestureEngine.init(this, this.game.canvas, {
        success: _onGestureDetect,
        fail: _onGestureFail
    });
    
};

ControllerState.prototype.update = function() {

};


module.exports = ControllerState;