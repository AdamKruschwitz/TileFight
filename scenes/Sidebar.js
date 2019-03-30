class SidebarScene extends Phaser.Scene {

    pieces=[]; // An array of collected pieces, max size 4
    up;
    down;
    left;
    right;
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;
    activePiece;


    constructor() {
        super({
            key: "sidebar",
            physics: {
                arcade: {
                    debug: true
                }
            }
        });
    }

    preload() {
        this.load.image('sidebarBackground', 'assets/sidebar.png');
        this.load.image('LPiece', 'assets/L_piece.png');
        this.load.image('RPiece', 'assets/R piece.png');
        this.load.image('SquarePiece', 'assets/square piece.png');
        this.load.image('ZPiece', 'assets/Z piece.png');
        this.load.image('SPiece', 'assets/S piece.png');
        this.load.image('LinePiece', 'assets/line piece.png');
    }

    create() {
        // Set camera size and position
        this.cameras.main.setViewport(0, 0, 266, 600);
        this.cameras.main.setBackgroundColor({r:200, g:200, b:200, a:255});
        this.scene.bringToTop();
        this.add.sprite(0, 0, 'sidebarBackground').setOrigin(0);

        // Set up controls
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.input.keyboard.enabled = false;
    }

    update() {
        this.takePlayerInput();
    }

    takePlayerInput() {
        // UP
        if(this.up.isDown && !this.upPressed) {
            this.upPressed = true;
            this.activePiece.moveUp();
        }
        else if(this.up.isUp && this.upPressed) {
            this.upPressed = false;
        }

        // DOWN
        if(this.down.isDown && !this.downPressed) {
            this.downPressed = true;
            this.activePiece.moveDown();
        }
        else if(this.down.isUp && this.downPressed) {
            this.downPressed = false;
        }

        // LEFT
        if(this.left.isDown && !this.leftPressed) {
            this.leftPressed = true;
            this.activePiece.moveLeft();
        }
        else if(this.left.isUp && this.leftPressed) {
            this.leftPressed = false;
        }

        // RIGHT
        if(this.right.isDown && !this.rightPressed) {
            this.rightPressed = true;
            this.activePiece.moveRight();
        }
        else if(this.right.isUp && this.rightPressed) {
            this.rightPressed = false;
        }
    }

    pickupTile(tileType) {
        //TODO - implement tile type
        this.activePiece = new Piece(this, 'LPiece', 146, 98, [[0, -1], [-1, 0], [-2, 0]], 156, 284, 2, 1, Piece.defaultMove);
    }

    disableInput() {
        console.log("disabling input from Sidebar");
        this.takeInput = false;
    }

    enableInput() {
        console.log("enabling input from sidebar");
        this.takeInput = true;
    }
}