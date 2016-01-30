/**
 * boot.js
 * Entrypoint of the app. Initializes the main app.
**/

/*
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./sw.js')
           .then(function() { console.log("ServiceWorker registered"); });
}
*/

var Main = require('./src/main');

Main();
