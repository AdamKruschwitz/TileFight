class MainGameScene extends Phaser.Scene {

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
    takeInput = true;



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
    }

    create() {
        // Set the scene to take up the left 2/3 of the screen
        this.cameras.main.setViewport(266, 0, 534, 600);
        this.cameras.main.setBackgroundColor({r:255, g:255, b:255, a:255});
        this.scene.launch('sidebar');

        this.player = this.physics.add.sprite(50, 50, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDataEnabled();
        this.player.setData("tiles", []);
        this.player.setData("move1", this.playerDefaultMove());
        this.player.setData("move2", this.playerDefaultMove());
        this.player.setData("move3", this.playerDefaultMove());
        this.player.setData("move4", this.playerDefaultMove());

        console.log(this);

        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.space = this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);




    }

    update() {
        if(this.takeInput) this.takePlayerInput();
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
        this.player.setVelocityX(this.playerSpeed * horizontalDirection / diagonalHinder);
        this.player.setVelocityY(this.playerSpeed * verticalDirection / diagonalHinder);


        // Attacks
        if(this.space.isDown && !this.spacePressed) {
            this.spacePressed = true;
            this.playerBasicAttack();
        }
        else if(this.space.isUp && this.spacePressed) {
            this.spacePressed = false;
        }
    }

    createTilePickup() {
        let tilePickup = this.physics.add.sprite(50, 50, 'tilePickup');
        tilePickup.setDataEnabled();
        let tileType = Math.floor(Math.random() * 4);
        tilePickup.setData("tileType", tileType);

    }

    playerBasicAttack() {
        console.log("basicAttack attacks");
        // TODO - implement basic attack
    }

    onTilePickup(tile) {
        let tileType = tile.getData("tileType");
        this.disableInput();
        let sidebarScene = this.scene.get("sidebar");
        sidebarScene.enableInput();
        sidebarScene.pickupTile(tileType);
    }

    disableInput() {
        console.log("disabling input from Main Game");
        this.takeInput = false;
    }

    enableInput() {
        console.log("enabling input from Main Game");
        this.takeInput = true;
    }
}