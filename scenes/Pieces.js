class Piece {

    sprite;
    scene;
    centerX;
    centerY;
    otherSquares;
    positionX;
    positionY;
    move;
    onCooldown = false;
    cooldown;

    constructor(scene, spriteFileName, centerX, centerY, otherSquares, x, y, positionX, positionY, move, cooldown) {
        //console.log(scene);
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, spriteFileName);
        this.centerX = centerX;
        this.centerY = centerY;
        this.otherSquares = otherSquares;
        this.positionX = positionX;
        this.positionY = positionY;
        this.move = move;
        this.sprite.setOrigin(5/6, 0.75);
        this.cooldown = cooldown;
        console.log(otherSquares);
    }

    turnClockwise() {
        // Check if the piece can be turned in bounds
        let ableToTurn = true;
        this.otherSquares.forEach(function(point, context) {
            let newX = -point[1] + context.positionX;
            let newY = point[0] + context.positionY;
            if(newX >= 4 || newX < 0) ableToTurn = false;
            if(newY >= 4 || newY < 0) ableToTurn = false;
        }, this);

        if(ableToTurn) {
            // Turn the squares
            this.otherSquares.forEach(function (point) {
                //console.log(point);
                let temp = point[0];
                point[0] = -point[1];   // X = -Y
                point[1] = temp;        // Y = X
                //console.log(point);
            });

            this.sprite.angle += 90;
            console.log(this.otherSquares);
        }
    }

    turnCounterclockwise() {
        // Check if the piece can be turned in bounds
        let ableToTurn = true;
        this.otherSquares.forEach(function(point, context) {
            let newX = point[1] + context.positionX;
            let newY = -point[0] + context.positionY;
            if(newX >= 4 || newX < 0) ableToTurn = false;
            if(newY >= 4 || newY < 0) ableToTurn = false;
        }, this);

        // Turn the piece
        if(ableToTurn) {
            this.otherSquares.forEach(function (point) {
                let temp = point[0];
                point[0] = point[1];    // X = Y
                point[1] = -temp;       // Y = -X
            });

            this.sprite.angle -= 90;
            console.log(this.otherSquares);
        }
    }

    moveLeft() {
        //console.log('moving left');
        if(!(this.leftMostSquareOffset() + this.positionX - 1 < 0)) {
            this.positionX--;
            // TODO Move sprite one to the left
            this.sprite.setX(this.sprite.x - 48);
        }
    }

    moveRight() {
        //console.log('moving right');
        if(!(this.rightMostSquareOffset() + this.positionX + 1 >= 4)) {
            this.positionX++;
            // TODO Move sprite one to the right
            this.sprite.setX(this.sprite.x + 48);
        }
    }

    moveUp() {
        //console.log('moving up');
        if(!(this.topMostSquareOffset() + this.positionY - 1 < 0)) {
            this.positionY--;
            // TODO Move sprite one up
            this.sprite.setY(this.sprite.y - 48);
        }
    }

    moveDown() {
        //console.log('moving down');
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
        //console.log(xMin);
        return xMin;
    }

    rightMostSquareOffset() {
        let xMax = -4;
        this.otherSquares.forEach(function(square) {
            if(square[0] > xMax) {
                xMax = square[0];
            }
        });
        //console.log(xMax);
        return xMax;
    }

    topMostSquareOffset() {
        let yMin = 4;
        this.otherSquares.forEach(function(square) {
            if(square[1] < yMin) {
                yMin = square[1]
            }
        });
        //console.log(yMin);
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

    destroySprite() {
        this.sprite.destroy();
    }

    defaultMove() {
        console.log("activating default move");
    }

}