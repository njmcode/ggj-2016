'use strict';

var request = require('request');
var randomstring = require('randomstring');
var db = require('./database');

var handlers = {

    createGame: function(req, res) {
        var gameKey = randomstring.generate(5);
        db.getOrCreate(gameKey, function() {
            res.redirect('/' + gameKey);
        });
    },

    observeGame: function(req, res) {
        var joinURL = 'http://' + req.headers.host + '/c/' + req.params.game;

        res.render('master', {
            joinURL: joinURL,
            game: req.params.game
        });
    },

    playGame: function(req, res) {
        res.render('client', {game: req.params.game});
    },

    showQR: function(req, res) {
        var joinURL = 'http://' + req.headers.host + '/c/' + req.params.game;
        var url = 'http://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + joinURL;
        request.get(url).pipe(res);
    },

    bind: function(app) {
        app.get('/', handlers.createGame);
        app.get('/:game', handlers.observeGame);
        app.get('/c/:game', handlers.playGame);
        app.get('/qr/:game', handlers.showQR);
    }
};

module.exports = handlers;
