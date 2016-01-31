

var CONFIG = require('../config');

var socket, gameID;

function _setupSocket() {
    socket = io.connect();
    gameID = window._game;
}

var PlayfieldState = function(){
};

PlayfieldState.prototype.create = function() {
    console.log('PLAY FIELD');
    var state = this;
    state.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Setup the wizards
    state.wizards = {
        left: {
            projectiles: state.game.add.group(),
            shield: false,
            position: [200, 200]
        },
        right: {
            projectiles: state.game.add.group(),
            shield: false,
            position: [600, 200]
        }
    };
    state.wizards.left.sprite = state.game.add.sprite(state.wizards.left.position[0], state.wizards.left.position[1], 's-wizard');
    state.wizards.left.sprite.anchor.setTo(0.5, 0.5);
    state.wizards.left.sprite.scale.setTo(0.5, 0.5);
    state.wizards.left.sprite.health = 10;
    state.wizards.right.sprite = state.game.add.sprite(state.wizards.right.position[0], state.wizards.right.position[1], 's-wizard');
    state.wizards.right.sprite.anchor.setTo(0.5, 0.5);
    state.wizards.right.sprite.scale.setTo(0.5, 0.5);
    state.wizards.right.sprite.health = 10;
    state.game.physics.enable(state.wizards.left.sprite);
    state.game.physics.enable(state.wizards.right.sprite);
    
    // Create groups for projectiles and shields
    state.wizards.left.projectiles.enableBody = true;
    state.wizards.left.projectiles.physicsBodyType = Phaser.Physics.Arcade;
    state.wizards.right.projectiles.enableBody = true;
    state.wizards.right.projectiles.physicsBodyType = Phaser.Physics.Arcade;
    
    // Setup the socket for listening
    _setupSocket();
    
    // Function to handle projectile firing
    var fireProjectile = function (fromSide, data) {
        var sprite, pos, dest;
        
        // Where are we firing from, and at where?
        pos = state.wizards[fromSide].position;
        dest = state.wizards[(fromSide == 'left') ? 'right' : 'left'].position;
        
        // Create the projectile, and set the physics options
        sprite = state.game.add.sprite(pos[0], pos[1], 'shot');
        state.wizards[fromSide].projectiles.add(sprite);
        state.game.physics.enable(sprite);
        sprite.anchor.setTo(0.5, 0.5);
        sprite.scale.setTo( (fromSide == 'left') ? -0.25 : 0.25, 0.25);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.damageDealt = 1;     // Changes based on gesture modifiers
        state.game.physics.arcade.moveToXY(sprite, dest[0], dest[1], 100);
    };
    
    // Function to handle generating a shield
    var raiseShield = function (atSide, data) {
        var sprite, pos;
        
        // Kill any existing shield
        if ( state.wizards[atSide].shield ) {
            state.wizards[atSide].shield.kill();
            state.wizards[atSide].shield = false;
        }
        
        // Which side is creating the shield?
        pos = state.wizards[atSide].position;
        
        // Create the shield, and set the physics options
        state.wizards[atSide].shield = state.game.add.sprite(pos[0], pos[1], 'shield');
        state.game.physics.enable(state.wizards[atSide].shield);
        state.wizards[atSide].shield.anchor.setTo(0.5, 1);
        state.wizards[atSide].shield.scale.setTo( (atSide == 'left') ? -0.5 : 0.5, 0.5);
        state.wizards[atSide].shield.health = 1;      // Changes based on gesture modifiers
        state.wizards[atSide].shield.lifespan = Phaser.Timer.SECOND * 4;      // Shields automatically fade after a given amount of time
        state.wizards[atSide].shield.name = atSide;
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

PlayfieldState.prototype.update = function() {
    var state = this;
    
    // Handler for a projectile hitting a shield
    var shieldHit = function (shield, projectile) {
        console.log('shield hit', projectile.key, shield.key);
        shield.damage(projectile.damageDealt);
        if ( shield.exists ) {
            console.log('shield still exists');
        }
        else {
            console.log('shield dead');
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
    state.game.physics.arcade.overlap(state.wizards.left.projectiles, state.wizards.right.sprite, playerHit);
    if ( state.wizards.left.shield ) {
        state.game.physics.arcade.overlap(state.wizards.right.projectiles, state.wizards.left.shield, shieldHit );
    }
    state.game.physics.arcade.overlap(state.wizards.right.projectiles, state.wizards.left.sprite, playerHit);
};


module.exports = PlayfieldState;