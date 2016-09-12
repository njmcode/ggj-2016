/**
 * boot.js
 * Entrypoint of the app. Initializes the main app.
**/

var Main = require('./js/main');

window.WebFontConfig = {
    google: {
        families: [
            'VT323::latin'
        ]
    },
    active: function(){
        Main();
    }
};

var wf = document.createElement('script');
wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);


