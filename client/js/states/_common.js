'use strict';

module.exports = {
    setGameScale: function(game) {

        // Ensure the scaling mode of the game is properly set.
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

    },
    insertWeather: function(game) {

        var rainGfx = game.add.graphics(-10, -10);
        rainGfx.beginFill(0xffffff);
        rainGfx.drawRect(0, 0, 2, 20);
        var rainTex = game.add.renderTexture(rainGfx.width, rainGfx.height);
        rainTex.renderXY(rainGfx, 0, 0, true);

        // Create and trigger the emitter with appropriate rain-like motion -
        // downward velocity, minor horizontal drift & rotation, partial alpha
        var emitter = game.add.emitter(game.world.centerX, 0, 1000);
        emitter.width = game.width;
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1;
        emitter.setYSpeed(1000, 1500);
        emitter.setXSpeed(-80, -45);
        emitter.alpha = 0.2;
        emitter.minRotation = 0;
        emitter.maxRotation = 10;
        emitter.makeParticles(rainTex);
        emitter.start(false, 2000, 1, 0);

    }
};
