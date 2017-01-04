// connect to the socket server
var socket = io('http://localhost:1337');

var playersArr = [],
	curPlayer;

socket.on('joined', function(players, player) {
    console.log(player + ' joined');
    playersArr = players.slice(0);
	curPlayer = socket.id;
});

socket.on('dropped', function(players, player) {
    console.log(player + ' disconnected');
    playersArr = players.slice(0);
    //TODO: Needs work
    if (main.player2.id === player) {
        main.player2.id = null;
        main.player2.visible = false;
    }
    if (main.player3.id === player) {
        main.player3.id = null;
        main.player3.visible = false;
    }
    if (main.player4.id === player) {
        main.player4.id = null;
        main.player4.visible = false;
    }

});

socket.on('moved', function(players, player, dir) {
    playersArr = players.slice(0);
    if (main.player1.id === player) {
        //main.playAnim('player1', dir);
    }
    if (main.player2.id === player) {
        //main.playAnim('player2', dir);
    }
    if (main.player3.id === player) {
        //main.playAnim('player3', dir);
    }
    if (main.player4.id === player) {
        //main.playAnim('player4', dir);
    }
});

var main = {

    preload: function() {
        this.game.load.spritesheet('ga_walklr', 'assets/sprites/ga_walklr.png', 90, 90);
        game.stage.backgroundColor = '#424a4c';

        this.load.tilemap('level1', 'assets/maps/testmap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/images/pTnWftN.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('scifi', 'gameTiles');
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        // this.blockedLayer = this.map.createLayer('blockedLayer');

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.disableVisibilityChange = true;

        this.cursor = game.input.keyboard.createCursorKeys();

        this.player1 = game.add.sprite(200, 200, 'ga_walklr');
        this.player1.anchor.setTo(.5);
        this.player1.smoothed = false;

        this.player2 = game.add.sprite(200, 200, 'ga_walklr');
        this.player2.anchor.setTo(.5);
        this.player2.smoothed = false;

        this.player3 = game.add.sprite(200, 200, 'ga_walklr');
        this.player4 = game.add.sprite(200, 200, 'ga_walklr');

        this.player1.animations.add('walklr');
        this.player2.animations.add('walklr');
        this.player3.animations.add('walklr');
        this.player4.animations.add('walklr');

        // others = game.add.group();
        // others.add(this.player2);
        // others.add(this.player3);
        // others.add(this.player4);

        this.player1.id = null;
        this.player2.id = null;
        this.player3.id = null;
        this.player4.id = null;

        this.player2.visible = false;
        this.player3.visible = false;
        this.player4.visible = false;

        game.physics.arcade.enable(this.player1);
        this.player1.body.immovable = true;


		game.world.setBounds(0, 0, 1920, 1920);

    },

    update: function() {

        for (var i = 0; i < playersArr.length; i++) {
            var l = i + 1;
            this['player' + l].position.x = playersArr[i].posX;
            this['player' + l].position.y = playersArr[i].posY;
            if (!this['player' + l].id) {
                this['player' + l].id = playersArr[i].id;
                this['player' + l].visible = true;
				if (curPlayer === playersArr[i].id) {
					curPlayer = 'player' + l;
					game.camera.follow(this[curPlayer], Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
					console.log('you are ' + curPlayer);
				}
                console.log('player' + l);
            }
        }

        if (this.cursor.right.isDown) {
            socket.emit('right');
        } else if (this.cursor.left.isDown) {
            socket.emit('left');
        }
        if (this.cursor.up.isDown) {
            socket.emit('up');
        } else if (this.cursor.down.isDown) {
            socket.emit('down');
        }

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
    }

};

// Initialize Phaser, and start our 'main' state
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'content');
game.state.add('main', main);
game.state.start('main');
