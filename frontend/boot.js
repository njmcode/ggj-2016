'use strict';

/**
 * boot.js
 * Entrypoint of the app. Initializes the main app.
**/

var WebFont = require('webfontloader');
var Main = require('./js/main');

WebFont.load({
    google: {
        families: ['VT323::latin']
    },
    active: function() {
        new Main();
    }
});
