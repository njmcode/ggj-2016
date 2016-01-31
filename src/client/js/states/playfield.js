'use strict';

var CONFIG = require('../config');
var _common = require('./_common');
var Wizard = require('../actors/wizard');
var Tower = require('../actors/tower');
var gameID = window._game;


var PlayfieldState = function(){
};

PlayfieldState.prototype.preload = function() {
    _common.setGameScale(this.game);
};

PlayfieldState.prototype.create = function() {
    console.log('PLAY FIELD');
    this.socket = _common.socket;
    console.log(this.socket);
    var state = this;
    state.wizardMaxHealth = 10;

    this.createBackground();
    this.createWizards();
    this.createTowers();

    state.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Setup the wizards
    state.wizards = {
        left: {
            projectiles: state.game.add.group(),
            shield: false,
            preppedSpell: false,
            position: [100, 130]
        },
        right: {
            projectiles: state.game.add.group(),
            shield: false,
            preppedSpell: false,
            position: [680, 130]
        }
    };
    state.wizards.left.sprite = state.game.add.sprite(state.wizards.left.position[0], state.wizards.left.position[1], 's-wizard');
    state.wizards.left.sprite.anchor.setTo(1, 0.5);
    state.wizards.left.sprite.health = state.wizardMaxHealth;
    state.wizards.right.sprite = state.game.add.sprite(state.wizards.right.position[0], state.wizards.right.position[1], 's-wizard');
    state.wizards.right.sprite.anchor.setTo(0, 0.5);
    state.wizards.right.sprite.health = state.wizardMaxHealth;
    state.game.physics.enable([state.wizards.left.sprite, state.wizards.right.sprite]);
    
    // Create groups for projectiles and shields
    state.wizards.left.projectiles.enableBody = true;
    state.wizards.left.projectiles.physicsBodyType = Phaser.Physics.Arcade;
    state.wizards.right.projectiles.enableBody = true;
    state.wizards.right.projectiles.physicsBodyType = Phaser.Physics.Arcade;
    
    // Player is preparing a spell
    var prepSpell = function(onSide, data) {
        var pos, xOffset, sprite;
        console.log('prepare', arguments);
        
        // Who is preparing the spell?
        pos = state.wizards[onSide].position;
        xOffset = (onSide == 'left') ? 10 : -10;
        
        // Kill any existing spell
        if ( state.wizards[onSide].preppedSpell ) {
            state.wizards[onSide].preppedSpell.kill();
            state.wizards[onSide].preppedSpell = false;
        }
        
        // Create the sprite, and hold it
        sprite = state.game.add.sprite(pos[0], pos[1] + xOffset, data.intent);
        sprite.anchor.setTo(0.5, 0.5);
        sprite.scale.setTo( (onSide == 'left') ? -0.25 : 0.25, 0.25);
        
        state.wizards[onSide].preppedSpell = sprite;
    };
    
    // Function to handle projectile firing
    var fireProjectile = function (fromSide, data) {
        var sprite, dest;
        
        if ( !state.wizards[fromSide].preppedSpell ) {
            console.log('fizzle');
            return;
        }
        console.log('fire!', arguments);
        
        // Where are we firing at?
        dest = state.wizards[(fromSide == 'left') ? 'right' : 'left'].position;
        
        // Create the projectile, and set the physics options
        sprite = state.wizards[fromSide].preppedSpell;
        state.wizards[fromSide].preppedSpell = false;
        
        state.wizards[fromSide].projectiles.add(sprite);
        state.game.physics.enable(sprite);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.damageDealt = 1;     // Changes based on gesture modifiers
        state.game.physics.arcade.moveToXY(sprite, dest[0], dest[1], 100);
        
        // Create an emitter for particle effects
        // add draw emitter
        var geGfx = state.add.graphics(-20, -20);
        geGfx.beginFill(0xffcc00);
        geGfx.drawRect(0, 0, 10, 10);
        var geTex = state.add.renderTexture(geGfx.width, geGfx.height);
        geTex.renderXY(geGfx, 0, 0, true);

        var projectileEmitter = state.add.emitter(0, 0, 200);
        projectileEmitter.width = 50;
        projectileEmitter.height = 50;
        projectileEmitter.minParticleScale = 0.5;
        projectileEmitter.maxParticleScale = 1;
        projectileEmitter.setYSpeed(-20, 50);
        projectileEmitter.setXSpeed(400, 0);
        projectileEmitter.alpha = 1;
        projectileEmitter.minRotation = -10;
        projectileEmitter.maxRotation = 10;
        projectileEmitter.makeParticles(geTex);
        projectileEmitter.gravity = 0;
        projectileEmitter.start(false, 500, 1, 0);
        sprite.addChild(projectileEmitter);
    };
    
    // Function to handle generating a shield
    var raiseShield = function (atSide, data) {
        if ( !state.wizards[atSide].preppedSpell ) {
            console.log('fizzle');
            return;
        }
        console.log('duck and cover!', arguments);
        
        // Kill any existing shield
        if ( state.wizards[atSide].shield ) {
            state.wizards[atSide].shield.kill();
            state.wizards[atSide].shield = false;
        }
        
        // Expand the shield, and set the physics options
        state.wizards[atSide].shield = state.wizards[atSide].preppedSpell;
        state.wizards[atSide].preppedSpell = false;
        
        state.game.physics.enable(state.wizards[atSide].shield);
        state.wizards[atSide].shield.scale.setTo( (atSide == 'left') ? -0.5 : 0.5, 1);
        state.wizards[atSide].shield.health = 1;      // Changes based on gesture modifiers
        state.wizards[atSide].shield.lifespan = Phaser.Timer.SECOND * 4;      // Shields automatically fade after a given amount of time
        state.wizards[atSide].shield.name = atSide;
    };
    
    // Connect event
    state.socket.on('connect', function(data) {
    	console.log('PlayField received CONNECT');
        state.socket.emit('host', { game: gameID });
    });

    state.socket.on('gesture', function(data) {
        console.log('PlayField received GESTURE', data);
        
        switch ( data.state ) {
            // Prepare a spell
            case 'prep':
                prepSpell(data.player, data);
                break;
                
            // Cast a spell
            case 'action':
                switch ( data.intent ) {
                    case 'shot':
                        fireProjectile(data.player, data);
                        break;
                    case 'shield':
                        raiseShield(data.player, data);
                        break;
                }
                break;
        }
    });
};

PlayfieldState.prototype.createBackground = function() {
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
    _common.insertWeather(this.game);
}

PlayfieldState.prototype.createWizards = function() {
    this.leftWizard = new Wizard(this, 0x8833AA, 60, 60);
    this.rightWizard = new Wizard(this, 0x4411BB, 680, 60);

    this.game.add.existing(this.leftWizard);
    this.game.add.existing(this.rightWizard);
};

PlayfieldState.prototype.createTowers = function() {
    this.leftTower = new Tower(this, 20, 160);
    this.rightTower = new Tower(this, 640, 160);

    this.game.add.existing(this.leftTower);
    this.game.add.existing(this.rightTower);
};

PlayfieldState.prototype.update = function() {
    var state = this;
    
    // Handler for a projectile hitting a shield
    var shieldHit = function (shield, projectile) {
        console.log('shield hit', projectile.key, shield.key);
        shield.damage(projectile.damageDealt);
        if ( !shield.exists ) {
            state.wizards[shield.name].shield = false;
        }
        projectile.kill();
    };
    // Handler for a projectile hitting a player
    var playerHit = function (player, projectile) {
        console.log('player hit', projectile.key, player.key);
        player.damage(projectile.damageDealt);
        projectile.kill();
    }
    
    if ( state.wizards.right.shield ) {
        state.game.physics.arcade.overlap(state.wizards.left.projectiles, state.wizards.right.shield, shieldHit );
    }
    state.game.physics.arcade.overlap(state.wizards.right.sprite, state.wizards.left.projectiles, playerHit);
    if ( state.wizards.left.shield ) {
        state.game.physics.arcade.overlap(state.wizards.right.projectiles, state.wizards.left.shield, shieldHit );
    }
    state.game.physics.arcade.overlap(state.wizards.left.sprite, state.wizards.right.projectiles, playerHit);

    this.layers.forEach(function(layer) {
        if (layer.body.position.x < -800) {
            layer.body.velocity.x = (Math.random()) * 10;
        }
        if (layer.body.position.x >0) {
            layer.body.velocity.x = (Math.random()) * (-10);
        }
    });
};

PlayfieldState.prototype.render = function() {
    this.leftWizard.render();
    this.rightWizard.render();
    this.leftTower.render();
    this.rightTower.render();
};


module.exports = PlayfieldState;