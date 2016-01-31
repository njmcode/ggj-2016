'use strict';

var db = require('./database');
var uuid = require('uuid');


var Client = function(socket) {
    this.id = uuid.v4();
    this.game = null;
    this.position = null;
    this.socket = socket;
    this.bindEvents();
};

Client.prototype = {
    bindEvents: function() {
        this.socket.on('join', this.onJoin.bind(this));
        this.socket.on('host', this.onHost.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
        this.socket.on('gesture', this.onGesture.bind(this));
        this.socket.on('status', this.onStatus.bind(this));
    },
    onHost: function(data) {
        var self = this;
        this.game = data.game;
        db.getOrCreate(this.game, function(details) {
            self.socket.join(self.game);
            self.socket.emit('room', details);
        });
    },
    onJoin: function(data) {
        var self = this;
        if (data.id) {
            self.id = data.id;
        }
        self.game = data.game;
        db.getOrCreate(self.game, function(details) {
            if (details.left == null || details.left === self.id) {
                details.left = self.id;
                self.position = 'left';
                self.socket.join(self.game);
            } else if (details.right == null || details.right === self.id) {
                details.right = self.id;
                self.position = 'right';
                self.socket.join(self.game);
            } else {
                return self.socket.emit('fail', {
                    'reason': 'Room full'
                });
            }
            console.log(details);
            db.conn.set(self.game, JSON.stringify(details));
            self.socket.broadcast.to(self.game).emit('room', details);
            self.socket.emit('join', {
                id: self.id,
                position: self.position,
                health: 100,
                mana: 100
            });
        });
    },
    onDisconnect: function() {
        var self = this;
        db.getOrCreate(self.game, function(details) {
            if (details.left === self.id) {
                details.left = null;
            } else if (details.right === self.id) {
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
