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
    this.load.crossOrigin = 'anonymous';
    this.load.image('qr-code', window.qrCode);
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

    this.presentsTitle = this.add.text(this.game.world.centerX,
        50, STRINGS.titlePresents, CONFIG.font.smallStyle);
    this.presentsTitle.anchor.set(0.5);

    this.ghostTitle = this.add.sprite(400, 120, 'title-logo');
    this.ghostTitle.anchor.set(0.5);
    this.ghostTitle.alpha = 0.4;
    this.ghostTitle.tint = 0xffaacc;

    this.title = this.add.sprite(400, 120, 'title-logo');
    this.title.anchor.set(0.5);

    this.creditText = this.add.text(this.game.world.centerX,
        this.game.height - 10, STRINGS.titleCredit, CONFIG.font.smallStyle);
    this.creditText.anchor.setTo(0.5, 1);

    this.qr = this.add.sprite(250, 250, 'qr-code');
    this.qr.anchor.set(0.5);
    this.qr.scale.set(0.5);

    var style = { font: "18px VT323", fill: "#aaaaaa", wordWrap: true, wordWrapWidth: 180, align: "center" };
    this.info = this.add.text(430, 210, STRINGS.titleJoinPrompt + window.joinURL, style);


    this.socket = _common.socket;
    console.log(this.socket);
    this.socket.on('room', this.handleRoomStatus.bind(this));
    this.socket.emit('host', {
        game: window.game
    });
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

    this.ghostTitle.position.x = 400 + this.game.rnd.integerInRange(-5, 5);
    this.ghostTitle.position.y = 120 + this.game.rnd.integerInRange(-5, 5);
};

TitleState.prototype.handleRoomStatus = function(data) {
    var self = this;
    if (data.left != null && data.right != null) {
        setTimeout(function() {
            self.state.start('PlayField');
        }, 2500);
    }
}


module.exports = TitleState;