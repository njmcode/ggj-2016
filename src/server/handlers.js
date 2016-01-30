'use strict';

var randomstring = require('randomstring');

var handlers = {

    createGame: function(req, res) {
        var gameKey = randomstring.generate(5);
        res.redirect('/' + gameKey);
    },

    observeGame: function(req, res) {
        var joinURL = 'http://' + req.headers.host + '/c/' + req.params.game;
        res.render('master', {
            joinURL: joinURL
        });
    },

    playGame: function(req, res) {
        res.render('client');
    },

    bind: function(app) {
        app.get('/', handlers.createGame);
        app.get('/:game', handlers.observeGame);
        app.get('/c/:game', handlers.playGame);
    }
};

module.exports = handlers;
