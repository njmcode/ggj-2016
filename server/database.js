'use strict';

var redis = require('redis');
var conn = redis.createClient('redis://database');

module.exports = {
    conn: conn,
    getOrCreate: function(game, cb) {
        conn.get(game, function(err, details) {
            if (details == null) {
                var newGame = {
                    left: null,
                    right: null
                };
                conn.set(game, JSON.stringify(newGame));
                return cb(newGame);
            } else {
                cb(JSON.parse(details));
            }
        });
    }
};
