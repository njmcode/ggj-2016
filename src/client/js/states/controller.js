/**
 * controller.js
 * State for the controller UI logic.
**/

var CONFIG = require('../config');
var gestureEngine = require('../ui/gestures');

var statusText, fireButton, shieldButton;

/**
 * SOCKET LOGIC
 * Init socket connection, track some state, and bind some
 * functions to respond to events.
**/

var socket, gameID, playerData = {};

// Inits the socket and binds events
function _setupSocket() {
    socket = io.connect();
    gameID = window._game;  // injected in main.hbs

    // Connect event.
    // Fires when the controller first loads and hits the socket.
    // Emits a 'join' event which is picked up in the callback
    // below.
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
        // Store a local copy of the data passed in the join,
        // e.g. mana, health, position, etc.
        // Game logic later will use this
        for (var k in data) {
            playerData[k] = data[k];
        }
    });

    // Fired when a gesture is received *from the server*.
    // We probably don't need to react to these directly, the
    // master (playfield) will handle them and pass on events
    // to us.
    socket.on('gesture', function(data) {
        console.log('Controller received GESTURE', data);
        // === data.action
    });
}



/**
 * PLAYER ACTIONS
 * Logic for executing an attack/shield.
**/

// Tells the socket that we want to attack.
// Picked up by the 'master' (playfield).
// Also does all the UI we need locally to visualise the firing.
function _fireProjectile() {
	console.log('FIRE PROJECTILE');
	socket.emit('gesture', {
		action: 'fire',
        position: playerData.position
	});
}

// Tells the socket that we want to put up shields.
// Picked up by the 'master' (playfield).
// Also does all the UI we need locally to visualise the firing.
function _doShield() {
	console.log('SHIELD');
	socket.emit('gesture', {
		action: 'shield',
        position: playerData.position
	});
}


/**
 * GESTURE CALLBACKS
 * Logic for handling detected gestures.
 * Determine what to do depending on current status
 * and gesture used.
**/

// Fired when our gesture engine detects a gesture.
// We analyse what type and set up game logic accordingly.
function _onGestureDetect(gestureName) {
    console.log('gesture detected', gestureName);

    switch(gestureName) {
        case 'caret':
        case 'v':
            _fireProjectile();
            break;
        case 'circle':
        case 'rectangle':
            _doShield();
            break;
        default:
            console.log('unknown gesture');
            break;
    }
}

// Fired when a gesture is too short/not done right.
function _onGestureFail() {
    console.log('gesture failed');
}


/**
 * UI SETUP & LOGIC
**/
function _initBackdrop() {

    // add particle starfield

    // add frame


}


/**
 * MAIN STATE LOGIC
 * A Phaser State for the controller.
 * Preloads assets it needs and sets up socket, gestures
 * and UI.
**/

var ControllerState = function(){};

ControllerState.prototype.preload = function() {
    // Ensure the scaling mode of the game is properly set.
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    // Preload some assets
	this.load.image('icon-fire', '../public/assets/icon-fire.png');
	this.load.image('icon-shield', '../public/assets/icon-shield.png');
};

ControllerState.prototype.create = function() {
    console.log('CONTROLLER UI');

    // Init socket and gestures
    _setupSocket();
    gestureEngine.init(this, this.game.canvas, {
        success: _onGestureDetect,
        fail: _onGestureFail
    });

    _initBackdrop.call(this);
    
};

ControllerState.prototype.update = function() {

};


module.exports = ControllerState;