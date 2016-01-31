/**
 * title.js
 * State for the game title screen.
**/
'use strict';

var CONFIG = require('../config');

var TitleState = function(){
};

TitleState.prototype.create = function() {
    this.add.sprite(0, 0, 'starfield');
    this.add.sprite(0, 0, 'clouds');
    this.add.sprite(0, 0, 'dusk-mask');
    this.add.sprite(0, 0, 'vignette');
    this.layers = [
        this.add.sprite(-400, 0, 'layer3'),
        this.add.sprite(-400, 0, 'layer2'),
        this.add.sprite(-400, 0, 'layer1'),
    ];
    this.layers.forEach(function(layer) {
        this.game.physics.enable(layer, Phaser.Physics.ARCADE);
        layer.body.velocity.x = (Math.random() - 0.5) * 20;
    }, this);

    this.title = this.add.sprite(400, 120, 'title-logo');
    this.title.anchor.set(0.5);

    this.leftWizard = this.game.add.graphics(40, 60);
    this.rightWizard = this.game.add.graphics(700, 60);
};

TitleState.prototype.drawWizard = function(gfx, color) {
    var rand = function() {
        return (Math.random() - 0.5) * 10;
    }
    gfx.clear();
    gfx.lineStyle(2, color);
    var points = [
        [30 + rand(), 50 + rand()],
        [20 + rand(), 20 + rand()],
        [40 + rand(), 10 + rand()],
        [30 + rand(), 50 + rand()],
        [30 + rand(), 70 + rand()],
        [20 + rand(), 70 + rand()],
        [30 + rand(), 70 + rand()],
        [40 + rand(), 70 + rand()],
        [30 + rand(), 90 + rand()],
        [20 + rand(), 120 + rand()],
        [30 + rand(), 90 + rand()],
        [40 + rand(), 120 + rand()],
    ];
    points.forEach(function(pnt) {
        gfx.lineTo(pnt[0], pnt[1]);
    }, this);
};

TitleState.prototype.preRender = function() {
    this.drawWizard(this.leftWizard, 0x8833AA);
    this.drawWizard(this.rightWizard, 0x4411BB);
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