const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

class MainGameScene extends Phaser.Scene {

    enemies;
    player;
    spacePressed = false;
    playerSpeed = 300;
    up;
    down;
    left;
    right;
    one;
    two;
    three;
    four;
    space;
    sidebarScene;
    lastDirection = UP;



    constructor() {
        super({
            key: "mainGame",

            physics: {
                arcade: {
                    debug: true
                }
            },

            /*
            BUG: this doesn't load the input plugin :(
            plugins: [
                'Loader',
                'Input',
                'TweenManager',
                'DataManager',
                'Clock'
            ]
            */
        });
    }

    preload() {
        this.load.image('player', 'assets/black50.png');
        this.load.image('tilePickup', 'assets/circle20.png');
        this.load.image('hitbox', 'assets/black50.png');
    }

    create() {
        // Set the scene to take up the left 2/3 of the screen
        this.cameras.main.setViewport(266, 0, 534, 600);
        this.cameras.main.setBackgroundColor({r:255, g:255, b:255, a:255});
        this.scene.launch('sidebar');

        // Set up player
        this.player = new Player(this, 'player', 5);

        // Set up key controls
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.space = this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.enabled = true;

        this.makeTilePickUp(0, 200, 200);
        console.log(this);
        this.sidebarScene = this.scene.get("sidebar");
        console.log(this.sidebarScene);

        this.enemies = this.physics.add.group({
            collideWorldBounds: true
        });

        this.makeEnemy(300, 300);

    }

    update() {
        this.takePlayerInput();
    }

    playerDefaultMove() {
        console.log("No move selected");
    }

    takePlayerInput() {
        // Movement
        let horizontalDirection = this.right.isDown - this.left.isDown;
        let verticalDirection = this.down.isDown - this.up.isDown;
        let diagonalHinder = 1;

        //console.log(this.right + this.left);

        if(Math.abs(horizontalDirection) + Math.abs(verticalDirection) > 1)  diagonalHinder = Math.SQRT2;
        this.player.sprite.setVelocityX(this.playerSpeed * horizontalDirection / diagonalHinder);
        this.player.sprite.setVelocityY(this.playerSpeed * verticalDirection / diagonalHinder);


        // Attacks
        if(this.space.isDown && !this.spacePressed) {
            this.spacePressed = true;
            this.player.basicAttack();
        }
        else if(this.space.isUp && this.spacePressed) {
            this.spacePressed = false;
        }

        // Get last direction
        if(this.up.isDown) this.lastDirection = UP;
        else if(this.right.isDown) this.lastDirection = RIGHT;
        else if(this.down.isDown) this.lastDirection = DOWN;
        else if(this.left.isDown) this.lastDirection = LEFT;

    }

    makeRandomTilePickup(x, y) {
        let tileType = Math.floor(Math.random() * 4);
        let tile = this.makeTilePickUp(tileType);
        return tile;
    }

    makeTilePickUp(type, x, y) {
        console.log("creating pickup type " + type);
        let tile = this.physics.add.sprite(x, y, 'tilePickup');
        tile.setDataEnabled();
        tile.setData('type', type);
        this.physics.add.overlap(this.player.sprite, tile, this.onTilePickup, function() {return true}, this);
        return tile;
    }

    makeEnemy(x, y) {
        return new Enemy(this, this.enemies, 'player', 3, x, y);
    }

    onTilePickup(player, tile) {
        tile.destroy();
        //console.log(this);
        this.player.sprite.setVelocity(0);
        this.sidebarScene.input.keyboard.enabled = true;
        this.setAllKeysDownFalse();
        this.input.keyboard.enabled = false;
        this.sidebarScene.pickupTile(tile);
        //console.log(this.sidebarScene);
    }

    setAllKeysDownFalse() {
        this.one.isDown = false;
        this.two.isDown = false;
        this.three.isDown = false;
        this.four.isDown = false;
        this.up.isDown = false;
        this.down.isDown = false;
        this.left.isDown = false;
        this.right.isDown = false;
    }


}