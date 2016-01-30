'use strict';

var uuid = require('node-uuid');

var handlers = {

    masterHandler: function(req, res) {
        var gameKey = uuid.v4();
        var longURL = 'http://' + req.headers.host + '/join?id=' + gameKey;
        res.render('master', {
            joinURL: longURL
        });
    },

    clientHandler: function(req, res) {
        res.render('client');
    },

    bind: function(app) {
        app.get('/', handlers.masterHandler);
        app.get('/join', handlers.clientHandler);
    }
};

module.exports = handlers;
