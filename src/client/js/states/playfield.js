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
    var state = this;

    this.createBackground();
    this.createWizards();
    this.createTowers();

    // Audio
    state.audio_prep = this.add.audio('shield2');
    state.audio_shot = this.add.audio('shot3');
    state.audio_shield = this.add.audio('shield1');
    state.audio_scollide = this.add.audio('shield-collide4');
    state.audio_collide = this.add.audio('collide2');
    state.audio_death = this.add.audio('shield-collide1');

    this.game.add.sprite(0, 0, 'instructions1');

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
    state.wizards.left.sprite.name = 'left';
    state.wizards.left.sprite.anchor.setTo(1, 0.5);
    state.wizards.left.sprite.health = CONFIG.settings.health.base;
    state.wizards.left.sprite.name = 'left';

    state.wizards.right.sprite = state.game.add.sprite(state.wizards.right.position[0], state.wizards.right.position[1], 's-wizard');
    state.wizards.right.sprite.name = 'right';
    state.wizards.right.sprite.anchor.setTo(0, 0.5);
    state.wizards.right.sprite.health = CONFIG.settings.health.base;
    state.wizards.right.sprite.name = 'right';

    state.wizards.left.sprite.mana = CONFIG.settings.mana.base;
    state.wizards.right.sprite.mana = CONFIG.settings.mana.base;

    state.game.physics.enable([state.wizards.left.sprite, state.wizards.right.sprite]);
    
    // Create groups for projectiles and shields
    state.wizards.left.projectiles.enableBody = true;
    state.wizards.left.projectiles.physicsBodyType = Phaser.Physics.Arcade;
    state.wizards.right.projectiles.enableBody = true;
    state.wizards.right.projectiles.physicsBodyType = Phaser.Physics.Arcade;

    // Add meters for health and mana
    var hStyle = Object.create(CONFIG.font.baseStyle);
    hStyle.fill = '#e90f50';

    var mStyle = Object.create(CONFIG.font.baseStyle);
    mStyle.fill = '#456670';

    state.meters = {};
    ['left','right'].forEach(function(dir) {
        state.meters[dir] = {};
        
        var x = (dir === 'left') ? 10 : state.game.width - 10,
            y = 10;
        var tx = state.add.text(x, y, CONFIG.settings.health.base, hStyle);
        if(dir === 'right') tx.anchor.setTo(1, 0);
        state.meters[dir].health = tx;

        var y = 30;
        var tx = state.add.text(x, y, CONFIG.settings.mana.base, mStyle);
        if(dir === 'right') tx.anchor.setTo(1, 0);
        state.meters[dir].mana = tx;
    });
    
    
    // Players automatically regenerate mana over time
    var regenMana = function () {
        if ( state.wizards.left.sprite.mana < CONFIG.settings.mana.max ) {
            state.wizards.left.sprite.mana++;
            state.meters.left.mana.setText(state.wizards.left.sprite.mana);
        }
        if ( state.wizards.right.sprite.mana < CONFIG.settings.mana.max ) {
            state.wizards.right.sprite.mana++;
            state.meters.right.mana.setText(state.wizards.right.sprite.mana);
        }
    };
    var regenTimer = state.game.time.events.add(Phaser.Timer.SECOND * CONFIG.settings.mana.regen, regenMana, state);
    regenTimer.loop = true;
    
    // Casting a spell costs mana
    var calcManaCost = function (spellType, modifier, power) {
        var costSheet = CONFIG.settings.manaCost;
        var cost = 0;
        
        cost += costSheet[spellType];
        if ( modifier ) {
            cost += costSheet[modifier];
        }
        if ( power == 'high' ) {
            cost *= costSheet.powerMultiplier;
        }
        
        return cost;
    }
    
    // Player is preparing a spell
    var prepSpell = function(onSide, data) {
        var pos, xOffset, sprite, scaleVal;
        
        // Who is preparing the spell?
        pos = state.wizards[onSide].position;
        xOffset = (onSide == 'left') ? 10 : -10;
        
        // Check for life
        if ( !state.wizards[onSide].sprite.exists ) {
            console.log('Dead wizards cast no spells');
            return;
        }
        
        // Kill any existing spell
        if ( state.wizards[onSide].preppedSpell ) {
            state.wizards[onSide].preppedSpell.kill();
            state.wizards[onSide].preppedSpell = false;
        }
        
        // Create the sprite, and hold it
        sprite = state.game.add.sprite(pos[0], pos[1] + xOffset, data.intent);
        sprite.anchor.setTo(0.5, 0.5);
        scaleVal = (data.intent == 'shot') ? 0.15 : 0.25;
        sprite.scale.setTo( (onSide == 'left') ? -scaleVal : scaleVal, scaleVal);
        
        state.wizards[onSide].preppedSpell = sprite;

        // Play prep sound
        state.audio_prep.play();
    };
    
    // Function to handle projectile firing
    var fireProjectile = function (fromSide, data) {
        var sprite, dest, cost, shotSpeed;
        
        // Player is attempting to cast a spell (without preparing one first)
        if ( !state.wizards[fromSide].preppedSpell ) {
            console.log('fizzle');
            return;
        }
        
        // Player must have enough mana to cast the spell
        cost = calcManaCost('shot', false, data.power);
        if ( state.wizards[fromSide].sprite.mana < cost ) {
            console.log('fizzle - no mana!');
            state.wizards[fromSide].preppedSpell.kill();
            state.wizards[fromSide].preppedSpell = false;
            return;
        }
        else {
            state.wizards[fromSide].sprite.mana -= cost;
            state.meters[fromSide].mana.setText(state.wizards[fromSide].sprite.mana);
        }
        
        // Where are we firing at?
        dest = state.wizards[(fromSide == 'left') ? 'right' : 'left'].position;
        
        // Create the projectile, and set the physics options
        sprite = state.wizards[fromSide].preppedSpell;
        state.wizards[fromSide].preppedSpell = false;
        
        state.wizards[fromSide].projectiles.add(sprite);
        state.game.physics.enable(sprite);
        sprite.scale.setTo( (fromSide == 'left') ? -0.25 : 0.25, 0.25);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.damageDealt = CONFIG.settings.spells.shotDamage;     // Changes based on gesture modifiers
        shotSpeed = CONFIG.settings.spells.shotBaseSpeed;
        state.game.physics.arcade.moveToXY(sprite, dest[0], dest[1], (data.power == 'low') ? shotSpeed : shotSpeed * 2);
        
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
        projectileEmitter.setXSpeed(0, 400);
        projectileEmitter.alpha = 1;
        projectileEmitter.minRotation = -10;
        projectileEmitter.maxRotation = 10;
        projectileEmitter.makeParticles(geTex);
        projectileEmitter.gravity = 0;
        projectileEmitter.start(false, 500, 1, 0);
        sprite.addChild(projectileEmitter);

        // Play shot sound
        state.audio_shot.play();
    };
    
    // Function to handle generating a shield
    var raiseShield = function (atSide, data) {
        var cost;
        
        // Player is attempting to cast a spell (without preparing one first)
        if ( !state.wizards[atSide].preppedSpell ) {
            console.log('fizzle');
            return;
        }
        
        // Player must have enough mana to cast the spell
        cost = calcManaCost('shield', false, data.power);
        if ( state.wizards[atSide].sprite.mana < cost ) {
            console.log('fizzle - no mana!');
            state.wizards[atSide].preppedSpell.kill();
            state.wizards[atSide].preppedSpell = false;
            return;
        }
        else {
            state.wizards[atSide].sprite.mana -= cost;
            state.meters[atSide].mana.setText(state.wizards[atSide].sprite.mana);
        }
        console.log('duck and cover!', 'cost: ' + cost, 'mana remaining: ' + state.wizards[atSide].sprite.mana);
        
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
        state.wizards[atSide].shield.lifespan = Phaser.Timer.SECOND * CONFIG.settings.spells.shieldLength;      // Shields automatically fade after a given amount of time
        state.wizards[atSide].shield.name = atSide;

        // Play shield sound
        state.audio_shield.play();
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
    this.starBG = this.add.tileSprite(0, 0, 800, 300, 'starfield', 0);

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
};

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

        // Play shield collision sound
        state.audio_scollide.play();
    };
    // Handler for a projectile hitting a player
    var playerHit = function (player, projectile) {
        player.damage(projectile.damageDealt);
        state.meters[player.name].health.setText(player.health);
        if ( !player.exists ) {
            playerDead(player);
        }
        projectile.kill();

        // Play collision sound
        state.audio_collide.play();
    };
    // Handler for player dying (health reaches zero)
    var playerDead = function (player) {
        // Clear the visual and any spells
        state[player.name + 'Wizard'].clear();
        var wizard = state.wizards[player.name];
        if ( wizard.preppedSpell ) {
            wizard.preppedSpell.kill();
            wizard.preppedSpell = false;
        }
        
        // Particle explosion!
        // Create an emitter for particle effects
        // add draw emitter
        var geGfx = state.add.graphics(-20, -20);
        geGfx.beginFill(0xffcc00);
        geGfx.drawRect(0, 0, 10, 10);
        var geTex = state.add.renderTexture(geGfx.width, geGfx.height);
        geTex.renderXY(geGfx, 0, 0, true);
        
        var pos = state.wizards[player.name].position;
        var deathEmitter = state.add.emitter(pos[0], pos[1], 200);
        deathEmitter.width = 50;
        deathEmitter.height = 50;
        deathEmitter.minParticleScale = 0.5;
        deathEmitter.maxParticleScale = 1;
        deathEmitter.setYSpeed(-500, 500);
        deathEmitter.setXSpeed(-500, 500);
        deathEmitter.alpha = 1;
        deathEmitter.minRotation = -10;
        deathEmitter.maxRotation = 10;
        deathEmitter.makeParticles(geTex);
        deathEmitter.gravity = 0;
        deathEmitter.start(false, 500, 1, 0);
        // Emitter can be destroyed two seconds later
        state.game.time.events.add(Phaser.Timer.SECOND * 2, deathEmitter.destroy, deathEmitter);

        // Play death sound
        state.audio_death.play();
    };
    
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

    this.starBG.tilePosition.x += 0.1;
};

PlayfieldState.prototype.render = function() {
    if ( this.wizards.left.sprite.exists ) {
        this.leftWizard.render();
    }
    if ( this.wizards.right.sprite.exists ) {
        this.rightWizard.render();
    }
    this.leftTower.render();
    this.rightTower.render();
};


module.exports = PlayfieldState;
