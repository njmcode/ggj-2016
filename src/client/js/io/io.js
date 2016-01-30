var socket = io.connect();
var game = window._game;
var id = Math.random();

socket.on('connect', function() {
	console.log('CONNECTED');
});

socket.on('gesture', function(data) {
    console.log(data);
});

socket.on('join', function(data) {
    console.log(data);
});

/*setInterval(function() {
    socket.emit('gesture', {
        id: id
    })
}, 200);*/

module.exports = {
	socket: socket,
	game: game,
	id: id
};