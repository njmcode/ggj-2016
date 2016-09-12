'use strict';

var Wizard = function(state, color, x, y) {
    Phaser.Graphics.call(this, state.game, x, y);
    this.game = state.game;
    this.animState = 'idle';
    this.color = color;
    this.randScale = 80;
};

Wizard.prototype = Object.create(Phaser.Graphics.prototype);
Wizard.prototype.constructor = Wizard;

Wizard.prototype.pointStates = {
    idle: [
        [30, 50], // neck
        [20, 20], // head left
        [40, 10], // head right
        [30, 50], // neck
        [30, 70], // chest
        [20, 70], // left hand
        [30, 70], // chest
        [40, 70], // right hand
        [30, 70], // chest
        [30, 90], // crotch
        [20, 120], // left foot
        [30, 90], // crotch
        [40, 120] // right foot
    ]
};

Wizard.prototype.render = function() {
    var self = this;
    if (self.randScale > 10) {
        self.randScale -= 3;
    }
    var rand = function() {
        return (Math.random() - 0.5) * self.randScale;
    };
    this.clear();
    this.lineStyle(2, this.color);
    var points = this.pointStates[this.animState];
    points.forEach(function(pnt) {
        this.lineTo(pnt[0] + rand(), pnt[1] + rand());
    }, this);
};

module.exports = Wizard;
