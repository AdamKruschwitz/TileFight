class SidebarScene extends Phaser.Scene {

    pieces=[]; // An array of collected pieces, max size 4
    grid = [                // Where all of the pieces are placed.
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
    ];
    mainGameScene;
    up;
    down;
    left;
    right;
    one;
    two;
    three;
    four;
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;
    onePressed = false;
    twoPressed = false;
    threePressed = false;
    fourPressed = false;
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
        this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.four = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.input.keyboard.enabled = false;

        // Get a reference to the main scene
        this.mainGameScene = this.scene.get("mainGame");
        console.log("mainGameScene: " + this.mainGameScene);
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

        // ONE - turn counterclockwise
        if(this.one.isDown && !this.onePressed) {
            this.onePressed = true;
            this.activePiece.turnCounterclockwise();
        }
        else if(this.one.isUp && this.onePressed) {
            this.onePressed = false;
        }

        // TWO - turn clockwise
        if(this.two.isDown && !this.twoPressed) {
            this.twoPressed = true;
            this.activePiece.turnClockwise();
        }
        else if(this.two.isUp && this.twoPressed) {
            this.twoPressed = false;
        }

        // THREE - place/switch tiles
        if(this.three.isDown && !this.threePressed) {
            this.threePressed = true;
            // Get a 2d array of square positions, set the otherSquares squares to be their actual grid positions
            // as opposed to their relative positions
            let squares = [
                [this.activePiece.positionX, this.activePiece.positionY],
                this.cloneArray(this.activePiece.otherSquares[0]),
                this.cloneArray(this.activePiece.otherSquares[1]),
                this.cloneArray(this.activePiece.otherSquares[2])
            ];

            for(let i=1; i<squares.length; i++) {   // OtherSquares holds positions relative to positionX and Y.
                squares[i][0] += squares[0][0];     // This code translates those relative positions to grid positions
                squares[i][1] += squares[0][1];
            }

            // Check if the piece can be placed in it's current position
            let overlappingTiles = -1;
            let canPlace = true;
            squares.forEach(function(pos) {
                if(this.grid[pos[0]][pos[1]] != -1) {
                    if(overlappingTiles === -1 || overlappingTiles===this.grid[pos[0]][pos[1]]) {
                        overlappingTiles = this.grid[pos[0]][pos[1]];
                    }
                    else canPlace = false;
                }
            }, this);

            // If a piece can be placed...
            if(canPlace) {
                if(overlappingTiles === -1) { // And it doesn't overlap anything, place the piece
                    this.pieces.push(this.activePiece);
                    let piecesIndex = this.pieces.findIndex(function(child) {
                        return child == this.activePiece;
                    }, this);
                    squares.forEach(function (pos) {
                        this.grid[pos[0]][pos[1]] = piecesIndex;
                    }, this);

                    this.mainGameScene.input.keyboard.enabled = true; // Automatically return to main game
                    this.input.keyboard.enabled = false;
                    this.setAllKeysDownFalse();
                    this.activePiece = null;
                    this.mainGameScene.makeTilePickUp(0);
                }
                else { // Pick up the overlapping tile and place the current active tile
                    let temp = this.activePiece;
                    this.activePiece = this.pieces[overlappingTiles];

                    // Remove the tile from the grid
                    this.pieces.splice(overlappingTiles, 1);
                    this.pieces.push(null);
                    for(let i=0; i<this.grid.length; i++) {
                        for(let j=0; j<this.grid[i].length; j++) {
                            if(this.grid[i][j] == overlappingTiles) this.grid[i][j] = -1;
                        }
                    }

                    this.pieces.push(temp);
                    let piecesIndex = this.pieces.findIndex(function(child) {
                        return child == temp;
                    });
                    squares.forEach(function (pos) {
                        this.grid[pos[0]][pos[1]] = piecesIndex;
                    }, this);
                }
            }
        }
        else if(this.three.isUp && this.threePressed) {
            this.threePressed = false;
        }

        // FOUR - return to main game and discard active piece
        if(this.four.isDown && !this.fourPressed) {
            this.fourPressed = true;

        // TODO - save the discarded piece somehow?
            this.activePiece.destroySprite();
            this.activePiece = null;
            this.mainGameScene.input.keyboard.enabled = true;
            this.input.keyboard.enabled = false;
            this.setAllKeysDownFalse();
        }
        else if(this.four.isUp && this.fourPressed) {
            this.fourPressed = false;
        }


    }

    pickupTile(tileType) {
        //TODO - implement tile type
        this.activePiece = new Piece(this, 'LPiece', 146, 98, [[0, -1], [-1, 0], [-2, 0]], 156, 284, 2, 1, Piece.defaultMove);
    }

    cloneArray(array) {
        let deepCopy = [];
        array.forEach(function(item) {
            deepCopy.push(item);
        });
        return deepCopy;
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