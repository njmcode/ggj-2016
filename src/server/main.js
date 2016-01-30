'use strict';

var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var handlebars = require('express-handlebars');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var handlers = require('./handlers');
var SocketConnection = require('./sockets');


app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

io.on('connection', function(socket) {
    new SocketConnection(socket);
});

handlers.bind(app);

server.listen(5000, function() {
    console.log('Server up and listening for connections...');
});
