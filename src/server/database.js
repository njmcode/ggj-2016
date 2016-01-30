'use strict';

var redis = require('redis');
var conn = redis.createClient('redis://database');

module.exports = {
    conn: conn,
    getOrCreate: function(game, cb) {
        conn.get(game + '-details', function(err, details) {
            console.log(details);
            if (details == null) {
                details = {
                    left: null,
                    right: null
                };
                conn.set(game + '-details', JSON.stringify(details));
            }
            cb(JSON.parse(details));
        });
    }
};
