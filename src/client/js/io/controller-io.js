var socket = io.connect();
var game = window._game;
var id = Math.random();

socket.on('connect', function(){
    socket.emit('join', {game: game});
});

socket.on('gesture', function(data) {
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