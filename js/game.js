// connect to the socket server
var socket = io('http://localhost:1337');
var playersArr = [],
    localSocket;

const speed = 250;


Player = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ga_walklr');
    this.smoothed = false;
    this.anchor.setTo(.5);

    //Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.enable = true;
    this.body.immovable = true;

    this.id = null;
    this.visible = false;

    this.animations.add('walklr');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Player.prototype.update = function() {
//
//
// };

var main = {

    preload: function() {
        this.game.load.spritesheet('ga_walklr', 'assets/sprites/ga_walklr.png', 80, 80);
        game.stage.backgroundColor = '#424a4c';
        this.load.tilemap('level1', 'assets/maps/testmap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/images/pTnWftN.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('scifi', 'gameTiles');
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        game.world.setBounds(0, 0, 1920, 1920);

        game.stage.disableVisibilityChange = true;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Local Player
        this.localPlayer = new Player(game, 200, 200);
        game.add.existing(this.localPlayer);
        this.localPlayer.visible = true;
        game.camera.follow(this.localPlayer, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // Remote Players
        this.remotePlayers = game.add.group();

        this.remote1 = new Player(game, 200, 200);
        game.add.existing(this.remote1);
        this.remotePlayers.add(this.remote1);

        this.remote2 = new Player(game, 200, 200);
        game.add.existing(this.remote2);
        this.remotePlayers.add(this.remote2);

        this.remote3 = new Player(game, 200, 200);
        game.add.existing(this.remote3);
        this.remotePlayers.add(this.remote3);


        // Controls
        this.cursor = game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        game.time.advancedTiming = true;

        for (var i = 0; i < playersArr.length; i++) {
            if (playersArr[i].id !== localSocket) {
                for (var j = 0; j < main.remotePlayers.children.length; j++) {
                    if (!main.remotePlayers.children[j].id) {
                        main.remotePlayers.children[j].id = playersArr[i].id;
						main.remotePlayers.children[j].visible = true;
						break;
                    }
                }
            }
        }

    },

    update: function() {

        if (!this.localPlayer.id) {
            this.localPlayer.id = localSocket;
        }

        // for (var i = 0; i < playersArr.length; i++) {
        //     var l = i + 1;
        //     // this['player' + l].x = playersArr[i].posX;
        //     // this['player' + l].y = playersArr[i].posY;
        //     if (playersArr[i].id !== this.localPlayer.id) {
        //         if (!this['player' + l].id) {
        //             this['player' + l].id = playersArr[i].id;
        //             this['player' + l].visible = true;
        //             console.log('player' + l);
        //         }
        //
        //     }
        //
        // }

        // this.remotePlayers.forEach(function(item) {
        //
        // });

        this.localPlayer.body.velocity.x = 0;
        this.localPlayer.body.velocity.y = 0;

        if (main.cursor.right.isDown || main.wasd.right.isDown) {
            //socket.emit('right');
            this.localPlayer.body.velocity.x = speed;

        } else if (main.cursor.left.isDown || main.wasd.left.isDown) {
            //socket.emit('left');
            this.localPlayer.body.velocity.x = -speed;
        }
        if (main.cursor.up.isDown || main.wasd.up.isDown) {
            //socket.emit('up');
            this.localPlayer.body.velocity.y = -speed * 0.8;
        } else if (main.cursor.down.isDown || main.wasd.down.isDown) {
            //socket.emit('down');
            this.localPlayer.body.velocity.y = speed * 0.8;
        }

        // Mouse position relative to sprite
        // if (game.input.x <= game.width/2) {
        // 	console.log('left');
        // } else {
        // 	console.log('right');
        // }

        //game.physics.arcade.overlap(this.player1, this.player2, this.collisionHandler, null, this);

		main.remotePlayers.forEach(function(item) {
            //console.log(item.position);

        });


    },

    collisionHandler: function() {
        //socket.emit('overlap');
    },

    playAnim: function(player, dir) {
        switch (dir) {
            case 'left':
                this[player].scale.x = -1;
                this[player].animations.play('walklr', 10);
                break;
            case 'right':
                this[player].scale.x = 1;
                this[player].animations.play('walklr', 10);
                break;
            case 'up':
                this[player].animations.play('walklr', 10);
                break;
            case 'down':
                this[player].animations.play('walklr', 10);
                break;
            default:
                this[player].animations.stop();
        }
    },

    serverLoop: function() {
        socket.emit('playerInfo', main.localPlayer.position);
        //console.log(main.localPlayer.position);
    },

    render: function() {
        game.debug.text(game.time.fps, 2, 14, "#00ff00");
        game.debug.body(this.localPlayer);
    }

};

// sockets
socket.on('joined', function(players, player) {
    playersArr = players.slice(0);
    if (!localSocket) {
        localSocket = socket.id;
        console.log('my id is ' + socket.id);

    } else {
        console.log(player + ' joined');
        main.remotePlayers.forEach(function(item) {
            if (!item.id) {
                item.id = player;
                item.visible = true;
            }
        });
    }
});

socket.on('dropped', function(players, player) {
    console.log(player + ' disconnected');
    playersArr = players.slice(0);
    // //TODO: Needs work
    // if (main.player2.id === player) {
    //     main.player2.id = null;
    //     main.player2.visible = false;
    // }
    // if (main.player3.id === player) {
    //     main.player3.id = null;
    //     main.player3.visible = false;
    // }
    // if (main.player4.id === player) {
    //     main.player4.id = null;
    //     main.player4.visible = false;
    // }

});

socket.on('moved', function(players, player, dir) {
    playersArr = players.slice(0);
	//console.log(players);
    // if (main.player1.id === player) {
    //     main.playAnim('player1', dir);
    // }
    // if (main.player2.id === player) {
    //     //main.playAnim('player2', dir);
    // }
    // if (main.player3.id === player) {
    //     //main.playAnim('player3', dir);
    // }
    // if (main.player4.id === player) {
    //     //main.playAnim('player4', dir);
    // }
});

setInterval(main.serverLoop, 2000);

// Initialize Phaser, and start our 'main' state
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'content');
game.state.add('main', main);
game.state.start('main');
