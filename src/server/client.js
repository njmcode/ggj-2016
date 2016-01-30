'use strict';

var db = require('./database');


var Client = function(socket) {
    this.game = null;
    this.position = null;
    this.socket = socket;
    this.bindEvents();
};

Client.prototype = {
    bindEvents: function() {
        this.socket.on('join', this.onJoin.bind(this));
        this.socket.on('host', this.onDisconnect.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
        this.socket.on('gesture', this.onGesture.bind(this));
        this.socket.on('status', this.onStatus.bind(this));
    },
    onHost: function(data) {
        this.game = data.game;
        db.getOrCreate(this.game, function() {
            this.socket.join(this.game);
        });
    },
    onJoin: function(data) {
        var self = this;
        self.game = data.game;
        db.getOrCreate(self.game, function(details) {
            if (details.left == null) {
                details.left = self;
                self.position = 'left';
                self.socket.join(self.game);
            } else if (details.right == null) {
                details.right = self;
                self.position = 'right';
                self.socket.join(self.game);
            } else {
                console.error('TWO PLAYERS ALREADY CONNECTED');
            }
            db.conn.set(self.game, details);
            self.socket.emit('join', {
                position: self.position,
                health: 100,
                mana: 100
            });
        });
    },
    onDisconnect: function() {
        var self = this;
        db.getOrCreate(self.game, function(details) {
            if (details.left === self) {
                details.left = null;
            } else if (details.right === self) {
                details.right = null;
            }
        });
    },
    onGesture: function(data) {
        if (this.game) {
            this.socket.broadcast.to(this.game).emit('gesture', data);
        }
    },
    onStatus: function(data) {
        if (this.game) {
            this.socket.broadcast.to(this.game).emit('status', data);
        }
    }
};

module.exports = Client;
