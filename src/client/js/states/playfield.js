

var CONFIG = require('../config');
var IO = require('../io/io');

var PlayfieldState = function(){
};

PlayfieldState.prototype.create = function() {
    console.log('PLAY FIELD');

    // Connect event
    IO.socket.on('connect', function(data) {
    	console.log('CONNECTED AS HOST');
        IO.socket.emit('host', { game: IO.game });
    });
};

PlayfieldState.prototype.update = function() {
};


module.exports = PlayfieldState;