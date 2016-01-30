'use strict';

var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var handlebars = require('express-handlebars');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


var globals = {
    connections: []
};


var httpHandlers = {

    index: function(req, res) {
        res.render('index');
    },
    controller: function(req, res) {
        res.render('controller');
    }

};

app.get('/', httpHandlers.index);
app.get('/controller', httpHandlers.controller);


io.on('connection', function(socket) {

    var socketHandlers = {

        join: function() {
            globals.connections.push(socket);
            socket.emit('connected');
        },
        disconnect: function() {
            globals.connections.splice(globals.connections.indexOf(socket), 1);
        }

    };

    socket.on('join', socketHandlers.join);
    socket.on('disconnect', socketHandlers.disconnect);

});


server.listen(5000, function() {
    console.log('Server up and listening for connections...');
});
