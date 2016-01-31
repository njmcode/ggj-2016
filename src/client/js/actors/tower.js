'use strict';

var Tower = function(state, x, y) {
    Phaser.Graphics.call(this, state.game, x, y);
    this.game = state.game;
};

Tower.prototype = Object.create(Phaser.Graphics.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.blocks = [
    [20, 20, 40, 40],
    [40, 20, 40, 40],
    [60, 20, 40, 40],
    [80, 20, 40, 40],

    [20, 30, 40, 40],
    [40, 30, 40, 40],
    [60, 30, 40, 40],
    [80, 30, 40, 40],

    [40, 20, 40, 50],
    [40, 50, 40, 50],
    [40, 80, 40, 50],
    [40, 110, 40, 50],
    [40, 140, 40, 50],
    [40, 170, 40, 50],
    [40, 200, 40, 50],
    [40, 230, 40, 50],
    [40, 260, 40, 50],

    [60, 20, 40, 50],
    [60, 50, 40, 50],
    [60, 80, 40, 50],
    [60, 110, 40, 50],
    [60, 140, 40, 50],
    [60, 170, 40, 50],
    [60, 200, 40, 50],
    [60, 230, 40, 50],
    [60, 260, 40, 50],
];

Tower.prototype.render = function() {
    if (this.skip) {
        this.skip = false;
        return;
    }
    this.skip = true;
    var rand = function() {
        return (Math.random() - 0.5) * 10;
    };
    var rgb2hex = function(r, g, b) {
        return (1 << 24) + (r << 16) + (g << 8) + b;
    }
    this.clear();
    this.blocks.forEach(function(block) {
        this.beginFill(rgb2hex(
            37,
            23,
            75 + (rand() * 3)
        ));
        this.drawRect(
            block[0] + rand(),
            block[1] + rand(),
            block[2] + rand(),
            block[3] + rand()
        );
        this.endFill();
    }, this);
};

module.exports = Tower;
