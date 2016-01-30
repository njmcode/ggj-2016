var socket = io.connect();
var game = window._game;
var id = Math.random();

socket.on('connect', function() {
	console.log('CONNECTED');
    var data = {
        game: game
    };
    if (window.location.hash) {
        data.id = window.location.hash;
    }
    socket.emit('join', data);
});

socket.on('gesture', function(data) {
    console.log(data);
});

socket.on('join', function(data) {
    console.log(data);
    window.location.hash = data.id;
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