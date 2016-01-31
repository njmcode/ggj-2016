/**
 * title.js
 * State for the game title screen.
**/
'use strict';

var CONFIG = require('../config');
var STRINGS = require('../strings');
var _common = require('./_common');

var TitleState = function(){};

TitleState.prototype.preload = function() {
    _common.setGameScale(this.game);
}

TitleState.prototype.create = function() {
    this.add.sprite(0, 0, 'starfield');

    var clouds = this.add.sprite(0, 0, 'clouds');
    this.add.tween(clouds).to({ alpha: 0.5 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1).yoyo(true);

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

    this.ghostTitle = this.add.sprite(400, 120, 'title-logo');
    this.ghostTitle.anchor.set(0.5);
    this.ghostTitle.alpha = 0.4;


    this.ghostTitle.tint = 0xffaacc;
    this.time.events.loop(20, function() {
        this.ghostTitle.position.x = 400 + this.game.rnd.integerInRange(-5, 5);
        this.ghostTitle.position.y = 120 + this.game.rnd.integerInRange(-5, 5);
    }, this);

    this.title = this.add.sprite(400, 120, 'title-logo');
    this.title.anchor.set(0.5);

    this.creditText = this.add.text(this.game.world.centerX,
        this.game.height - 10, STRINGS.titleCredit, CONFIG.font.smallStyle);
    this.creditText.anchor.setTo(0.5, 1);

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