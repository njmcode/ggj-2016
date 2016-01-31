/**
 * title.js
 * State for the game title screen.
**/
'use strict';

var CONFIG = require('../config');
var _common = require('./_common');

var TitleState = function(){};

TitleState.prototype.preload = function() {
    _common.setGameScale(this.game);
}

TitleState.prototype.create = function() {
    this.add.sprite(0, 0, 'starfield');
    this.add.sprite(0, 0, 'clouds');
    this.add.sprite(0, 0, 'dusk-mask');
    this.add.sprite(0, 0, 'vignette');
    this.layers = [
        this.add.sprite(-400, 0, 'layer3'),
        this.add.sprite(-400, 0, 'layer2'),
        this.add.sprite(-400, 0, 'layer1')
    ];
    this.layers.forEach(function(layer) {
        this.game.physics.enable(layer, Phaser.Physics.ARCADE);
        layer.body.velocity.x = (Math.random() - 0.5) * 20;
    }, this);

    this.title = this.add.sprite(400, 120, 'title-logo');
    this.title.anchor.set(0.5);
};

TitleState.prototype.update = function() {
    this.layers.forEach(function(layer) {
        if (layer.body.position.x < -800) {
            layer.body.velocity.x = (Math.random()) * 10;
        }
        if (layer.body.position.x >0) {
            layer.body.velocity.x = (Math.random()) * (-10);
        }
    });
};


module.exports = TitleState;