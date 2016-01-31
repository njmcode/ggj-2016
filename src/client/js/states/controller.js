/**
 * controller.js
 * State for the controller UI logic.
**/

var CONFIG = require('../config');
var gestureEngine = require('../ui/gestures');

var playerText;

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
        playerData.playerNumber = (playerData.position === 'left') ? 1 : 2;
        playerText.setText('Player ' + playerData.playerNumber);
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

// Set when the player has successfully drawn a gesture
// and we're waiting for a swipe action.
var currentSpell = null,
    currentRune = 'standard';
var currentSpellIcon = null;

var typeIcons = {
    'shot': 'icon-fire',
    'shield': 'icon-shield'
};

/*

{
    'gesture': {
        'player': 'left/right',
        'rune': 'standard/wind/earth/fire/water',
        'intent': 'shot/shield',
        'power': 'high/low',
        'state': 'action/prep'
    }
}

*/

var SPELL_TRAVEL_DIST = 500,
    SPELL_TRAVEL_TIME = 400;

// Show fx for the currently prepped spell
function _displayCurrentSpell(state, type) {
    if(!currentSpell) return false;


    currentSpellIcon = state.add.image(state.game.world.centerX,
        state.game.world.centerY, typeIcons[type]);
    currentSpellIcon.anchor.setTo(0.5, 0.5);
}

function _visuallyCastCurrentSpell(state, dir) {
    if(!currentSpell) return false;
    if(!currentSpellIcon) return false;

    var vy = (dir === 'up') ? -SPELL_TRAVEL_DIST : SPELL_TRAVEL_DIST;
    var tw = state.game.add.tween(currentSpellIcon.position).to({
            y: state.game.world.centerY + vy,
        }, SPELL_TRAVEL_TIME, Phaser.Easing.Exponential.In).start();
    var tw2 = state.game.add.tween(currentSpellIcon).to({
        alpha: 0
    }, SPELL_TRAVEL_TIME, Phaser.Easing.Exponential.In).start();
    tw.onComplete.add(function() {
        currentSpellIcon.destroy();
    });
}

function _prepSpell(state, spellName) {
    console.log('PREP', spellName);
    currentSpell = spellName;

    socket.emit('gesture', {
        'player': playerData.position,
        'rune': currentRune,
        'intent': currentSpell,
        'power': null,
        'state': 'prep'
    });

    _displayCurrentSpell(state, spellName);
}

function _doCurrentSpell(state, dir) {
    if(!currentSpell) return false;
    console.log('DO', currentSpell);

    socket.emit('gesture', {
        'player': 'playerData.position',
        'rune': currentRune,
        'intent': currentSpell,
        'power': 'high',
        'state': 'action'
    });

    _visuallyCastCurrentSpell(state, dir);

    // TODO: cooldown
    currentSpell = null;
}

function _cancelCurrentSpell(state) {
    if(!currentSpell) return false;
    // TODO: viz
    currentSpell = null;
}


/**
 * GESTURE CALLBACKS
 * Logic for handling detected gestures.
 * Determine what to do depending on current status
 * and gesture used.
**/

var gestureEmitter;

// Fired when our gesture engine detects a gesture.
// We analyse what type and set up game logic accordingly.
function _onGestureDetect(gestureName) {

    // TODO: add elemental/status modifier checks
    if(currentSpell) return false;

    var state = this;

    switch(gestureName) {
        case 'caret':
        case 'v':
            _prepSpell(state, 'shot');
            break;
        case 'circle':
        case 'rectangle':
        case 'pigtail':
            _prepSpell(state, 'shield');
            break;
        default:
            console.log('unknown gesture');
            break;
    }
}

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

function _onGestureDraw(x, y) {

    //console.log('gesture', x, y);
    gestureEmitter.x = x;
    gestureEmitter.y = y;
    gestureEmitter.explode(200, 2);  
    
}

// Fired when a gesture is too short/not done right.
function _onGestureFail() {
    console.log('gesture failed');
    //currentSpell = null;
}

function _onSwipe(dir) {
    
    if(!currentSpell) return false;

    var state = this;

    // TODO: cancellation mechanics
    switch(currentSpell) {
        case 'shot':
            if(dir === 'up') {
                _doCurrentSpell(state, dir);
            }
            break;
        case 'shield':
            if(dir === 'down') {
                _doCurrentSpell(state, dir);
            }
            break;
        default:
            break;
    }
}

/**
 * UI SETUP & LOGIC
**/

function _initBackdrop() {

    // add particle starfield
    var pGfx = this.add.graphics(-20, -20);
    pGfx.beginFill(0x370f50);
    pGfx.drawRect(0, 0, 20, 20);
    var pTex = this.add.renderTexture(pGfx.width, pGfx.height);
    pTex.renderXY(pGfx, 0, 0, true);

    var emitter = this.add.emitter(this.game.world.centerX, this.game.world.centerY, 500);
    emitter.width = this.game.width;
    emitter.height = this.game.height;
    emitter.minParticleScale = 0.5;
    emitter.maxParticleScale =  2;
    emitter.setYSpeed(-50, 50);
    emitter.setXSpeed(-50, 50);
    emitter.alpha = 0.6;
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.makeParticles(pTex);
    emitter.gravity = 0;
    emitter.start(false, 500, 1, 0);

    // add draw emitter
    var geGfx = this.add.graphics(-20, -20);
    geGfx.beginFill(0xffcc00);
    geGfx.drawRect(0, 0, 10, 10);
    var geTex = this.add.renderTexture(geGfx.width, geGfx.height);
    geTex.renderXY(geGfx, 0, 0, true);

    gestureEmitter = this.add.emitter(this.game.world.centerX, this.game.world.centerY, 200);
    gestureEmitter.width = 50;
    gestureEmitter.height = 50;
    gestureEmitter.minParticleScale = 0.5;
    gestureEmitter.maxParticleScale = 1;
    gestureEmitter.setYSpeed(-50, 50);
    gestureEmitter.setXSpeed(-50, 50);
    gestureEmitter.alpha = 1;
    gestureEmitter.minRotation = -10;
    gestureEmitter.maxRotation = 10;
    gestureEmitter.makeParticles(geTex);
    gestureEmitter.gravity = 0;
    //gestureEmitter.start(false, 500, 1, 0);



    // add frame


    // add player text
    playerText = this.add.text(this.game.width * 0.5, this.game.height -10, 
        '', CONFIG.font.baseStyle);
    playerText.anchor.setTo(0.5, 1);
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
        onGesture: _onGestureDetect,
        onDraw: _onGestureDraw,
        onBadGesture: _onGestureFail,
        onSwipe: _onSwipe
    });

    _initBackdrop.call(this);
    
};

ControllerState.prototype.update = function() {

};


module.exports = ControllerState;