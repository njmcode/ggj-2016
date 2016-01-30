'use strict';

var Client = function(socket) {
    this.game = null;
    this.socket = socket;
    this.bindEvents();
};

Client.prototype = {
    bindEvents: function() {
        this.socket.on('join', this.onJoin.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
        this.socket.on('gesture', this.onGesture.bind(this));
    },

    onJoin: function(data) {
        this.game = data.game;
        this.socket.join(this.game);
    },
    onDisconnect: function() {
    },
    onGesture: function(data) {
        if (this.game) {
            this.socket.broadcast.to(this.game).emit('gesture', data);
        }
    }
};

module.exports = Client;
