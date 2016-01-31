
module.exports = {
	setGameScale: function(game) {
		// Ensure the scaling mode of the game is properly set.
	    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    game.scale.pageAlignHorizontally = true;
	    game.scale.pageAlignVertically = true;
	}
};