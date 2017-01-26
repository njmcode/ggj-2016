'use strict';

var http = require('http');
var redis = require('socket.io-redis');
var express = require('express');
var socketio = require('socket.io');
var handlebars = require('express-handlebars');

var app = express();
var server = http.createServer(app);
var io = socketio(server);
io.adapter(redis({host: 'database'}));

var handlers = require('./handlers');
var Client = require('./client');

app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.use('/static', express.static('/static'));

handlers.bind(app);
io.on('connection', function(socket) {
    new Client(socket);
});

server.listen(5000, function() {
    console.log('Server up and listening for connections...');
});
