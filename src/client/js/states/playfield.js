'use strict';

var CONFIG = require('../config');
var Wizard = require('../actors/wizard');
var Tower = require('../actors/tower');
var socket, gameID;

function _setupSocket() {
    socket = io.connect();
    gameID = window._game;
}

var PlayfieldState = function(){
    this.avatarPositions = {
        left: [200, 300],
        right: [600, 300]
    }
};

PlayfieldState.prototype.create = function() {
    console.log('PLAY FIELD');
    var state = this;

    this.createBackground();
    this.createWizards();
    this.createTowers();

    state.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Create groups for projectiles and shields
    state.leftProjectiles = state.game.add.group();
    state.leftProjectiles.enableBody = true;
    state.leftProjectiles.physicsBodyType = Phaser.Physics.Arcade;
    state.rightProjectiles = state.game.add.group();
    state.rightProjectiles.enableBody = true;
    state.rightProjectiles.physicsBodyType = Phaser.Physics.Arcade;
    
    state.leftShields = state.game.add.group();
    state.leftShields.enableBody = true;
    state.leftShields.physicsBodyType = Phaser.Physics.Arcade;
    state.rightShields = state.game.add.group();
    state.rightShields.enableBody = true;
    state.rightShields.physicsBodyType = Phaser.Physics.Arcade;
    
    // Setup the socket for listening
    _setupSocket();
    
    // Function to handle projectile firing
    var fireProjectile = function (fromSide, data) {
        var sprite, pos, dest;
        
        // Where are we firing from, and at where?
        pos = state.avatarPositions[fromSide];
        dest = state.avatarPositions[(fromSide == 'left') ? 'right' : 'left'];
        
        // Create the projectile, and set the physics options
        sprite = state.game.add.sprite(pos[0], pos[1], 'icon-fire');
        state[fromSide + 'Projectiles'].add(sprite);
        state.game.physics.enable(sprite);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.damageDealt = 1;     // Changes based on gesture modifiers
        sprite.anchor.setTo(0.5, 0.5);
        state.game.physics.arcade.moveToXY(sprite, dest[0], dest[1], 100);
    };
    
    // Function to handle generating a shield
    var raiseShield = function (atSide, data) {
        var sprite, pos;
        
        // Which side is creating the shield?
        pos = state.avatarPositions[atSide];
        
        // Create the shield, and set the physics options
        sprite = state.game.add.sprite(pos[0], pos[1], 'icon-shield');
        state[atSide + 'Shields'].add(sprite);
        state.game.physics.enable(sprite);
        sprite.health = 1;      // Changes based on gesture modifiers
        sprite.lifespan = Phaser.Timer.SECOND * 4;      // Shields automatically fade after a given amount of time
        sprite.anchor.setTo(0.5, 0.5);
    };
    
    // Connect event
    socket.on('connect', function(data) {
    	console.log('PlayField received CONNECT');
        socket.emit('host', { game: gameID });
    });

    socket.on('gesture', function(data) {
        var sprite, pos, dest;
        console.log('PlayField received GESTURE', data);
        
        switch ( data.action ) {
            case 'fire':
                fireProjectile(data.position, data);
                break;
            case 'shield':
                raiseShield(data.position, data);
                break;
        }
    });
};

PlayfieldState.prototype.createBackground = function() {
    this.add.sprite(0, 0, 'starfield');
    this.add.sprite(0, 0, 'clouds');
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
    var shieldHit = function (projectile, shield) {
        shield.damage(projectile.damageDealt);
        projectile.kill();
    };
    
    this.game.physics.arcade.overlap(this.leftProjectiles, this.rightShields, shieldHit );
    this.game.physics.arcade.overlap(this.rightProjectiles, this.leftShields, shieldHit );
};

PlayfieldState.prototype.render = function() {
    this.leftWizard.render();
    this.rightWizard.render();
    this.leftTower.render();
    this.rightTower.render();
};


module.exports = PlayfieldState;