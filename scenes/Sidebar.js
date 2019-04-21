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
    activePiece;
    thisScene;



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

        // Keep track of context
        this.thisScene = this;

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

        //this.scene.pause();
    }

    update() {
        this.takePlayerInput();
    }

    takePlayerInput() {
        // UP
        if(Phaser.Input.Keyboard.JustDown(this.up)) {
            this.activePiece.moveUp();
        }

        // DOWN
        if(Phaser.Input.Keyboard.JustDown(this.down)) {
            this.activePiece.moveDown();
        }

        // LEFT
        if(Phaser.Input.Keyboard.JustDown(this.left)) {
            this.activePiece.moveLeft();
        }

        // RIGHT
        if(Phaser.Input.Keyboard.JustDown(this.right)) {
            this.activePiece.moveRight();
        }

        // ONE - turn counterclockwise
        if(Phaser.Input.Keyboard.JustDown(this.one)) {
            this.activePiece.turnCounterclockwise();
        }

        // TWO - turn clockwise
        if(Phaser.Input.Keyboard.JustDown(this.two)) {
            this.activePiece.turnClockwise();
        }

        // THREE - place/switch tiles
        if(Phaser.Input.Keyboard.JustDown(this.three)) {

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
                    //this.mainGameScene.makeTilePickUp(0); DEBUG
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

        // FOUR - return to main game and discard active piece
        if(Phaser.Input.Keyboard.JustDown(this.four)) {
            this.fourPressed = true;

        // TODO - save the discarded piece somehow?
            this.activePiece.destroySprite();
            this.activePiece = null;
            this.mainGameScene.input.keyboard.enabled = true;
            this.input.keyboard.enabled = false;
            this.setAllKeysDownFalse();
        }

    }

    pickupTile(tileType) {
        //TODO - implement tile type
        switch(tileType) {
            case 0:
                this.activePiece = new Piece(this, 'LPiece', 146, 98, [[0, -1], [-1, 0], [-2, 0]], 156, 284, 2, 1, this.mainGameScene.bigHit, 6000);
                break;
        }
        //this.activePiece = new Piece(this, 'LPiece', 146, 98, [[0, -1], [-1, 0], [-2, 0]], 156, 284, 2, 1, Piece.defaultMove);
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