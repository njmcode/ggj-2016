/**
 * hypertext.js
 * Specialized Button subclass which behaves like clickable text.
 * Button will automatically size to cover the text area.
**/

var CONFIG = require('../config');

/**
 * A Button subclass to emulate clickable text.
 * @param state - reference to a State instance
 * @param x, y - pixel co-ords of the center of the text
 * @param text - actual text string to display
 * @param style - text style object (optional, defaults to CONFIG.font.baseActionStyle)
 * @param onClickFn - callback to fire when text is clicked
 * @param ctx - context in which to fire the callback (usually a State instance)
**/
function HyperText(state, x, y, text, style, onClickFn, ctx) {
    // Inherit from Phaser's Button class
    Phaser.Button.call(this, state.game, x, y, null, onClickFn, ctx);

    // Set text style or use defaults
    this.style = style || CONFIG.font.baseStyle;
    this.anchor.setTo(0.5, 0.5);

    // Create text and align it to the center of the button
    this.text = new Phaser.Text(state.game, 0, 0, text, this.style);
    this.text.anchor.setTo(0.5, 0.5);
    this.addChild(this.text);
}

HyperText.prototype = Object.create(Phaser.Button.prototype);
HyperText.prototype.constructor = HyperText;

module.exports = HyperText;
