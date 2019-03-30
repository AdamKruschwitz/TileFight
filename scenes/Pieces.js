class Piece {

    sprite;
    scene;
    centerX;
    centerY;
    otherSquares;
    positionX;
    positionY;
    move;

    constructor(scene, spriteFileName, centerX, centerY, otherSquares, x, y, positionX, positionY, move) {
        console.log(scene);
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, spriteFileName);
        this.centerX = centerX;
        this.centerY = centerY;
        this.otherSquares = otherSquares;
        this.positionX = positionX;
        this.positionY = positionY;
        this.move = move;
        this.sprite.setOrigin(5/6, 0.75);
    }

    moveLeft() {
        console.log('moving left');
        if(!(this.leftMostSquareOffset() + this.positionX - 1 < 0)) {
            this.positionX--;
            // TODO Move sprite one to the left
            this.sprite.setX(this.sprite.x - 48);
        }
    }

    moveRight() {
        console.log('moving right');
        if(!(this.rightMostSquareOffset() + this.positionX + 1 >= 4)) {
            this.positionX++;
            // TODO Move sprite one to the right
            this.sprite.setX(this.sprite.x + 48);
        }
    }

    moveUp() {
        console.log('moving up');
        if(!(this.topMostSquareOffset() + this.positionY - 1 < 0)) {
            this.positionY--;
            // TODO Move sprite one up
            this.sprite.setY(this.sprite.y - 48);
        }
    }

    moveDown() {
        console.log('moving down');
        if(!(this.bottomMostSquareOffset() + this.positionY + 1 >= 4)) {
            this.positionY++;
            // TODO Move sprite one down
            this.sprite.setY(this.sprite.y + 48);
        }
    }

    leftMostSquareOffset() {
        let xMin = 4;
        this.otherSquares.forEach(function(square) {
            if(square[0] < xMin) {
                xMin = square[0]
            }
        });
        console.log(xMin);
        return xMin;
    }

    rightMostSquareOffset() {
        let xMax = -4;
        this.otherSquares.forEach(function(square) {
            if(square[0] > xMax) {
                xMax = square[0];
            }
        });
        console.log(xMax);
        return xMax;
    }

    topMostSquareOffset() {
        let yMin = 4;
        this.otherSquares.forEach(function(square) {
            if(square[1] < yMin) {
                yMin = square[1]
            }
        });
        console.log(yMin);
        return yMin;
    }

    bottomMostSquareOffset() {
        let yMax = -4;
        this.otherSquares.forEach(function(square) {
            if(square[1] > yMax) {
                yMax = square[1]
            }
        });
        //console.log(yMax);
        return yMax;
    }

    static defaultMove() {
        console.log("activating default move");
    }

}