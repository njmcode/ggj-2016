

var CONFIG = require('../config');

var socket, gameID;

function _setupSocket() {
    socket = io.connect();
    gameID = window._game;
}

var PlayfieldState = function(){
};

PlayfieldState.prototype.create = function() {
    console.log('PLAY FIELD');

    _setupSocket();

    // Connect event
    socket.on('connect', function(data) {
    	console.log('PlayField received CONNECT');
        socket.emit('host', { game: gameID });
    });
};

PlayfieldState.prototype.update = function() {
};


module.exports = PlayfieldState;