const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

class MainGameScene extends Phaser.Scene {

    enemies;
    player;
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
    thisScene;
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

        // keep track of context
        this.thisScene = this;

        // Set up player
        this.player = new Player(this, 'player', 5);

        // Set up key controls
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.one = this.input.keyboard.addKey('1');
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

        this.setUpInput();

        //this.scene.pause();

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
        if(Phaser.Input.Keyboard.JustDown(this.space)) {
            this.player.basicAttack();
        }

        // ONE - first piece move
        if(Phaser.Input.Keyboard.JustDown(this.one)) {
            console.log('onePressed');
            if(this.sidebarScene.pieces.length > 0) {
                this.sidebarScene.pieces[0].move();
            }
        }

        // TWO - second piece move
        if(Phaser.Input.Keyboard.JustDown(this.two)) {
            this.twoPressed = true;
            if(this.sidebarScene.pieces.length > 1) {
                this.sidebarScene.pieces[1].move();
            }
        }

        // THREE - third piece move
        if(Phaser.Input.Keyboard.JustDown(this.three)) {
            this.threePressed = true;
            if(this.sidebarScene.pieces.length > 2) {
                this.sidebarScene.pieces[2].move();
            }
        }

        // FOUR - first piece move
        if(Phaser.Input.Keyboard.JustDown(this.four)) {
            this.fourPressed = true;
            if(this.sidebarScene.pieces.length > 3) {
                this.sidebarScene.pieces[3].move();
            }
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
        tile.setData('tileType', type);
        this.physics.add.overlap(this.player.sprite, tile, this.onTilePickup, function() {return true}, this);
        return tile;
    }

    makeEnemy(x, y) {
        return new Enemy(this, this.enemies, 'player', 3, x, y);
    }

    onTilePickup(player, tile) {
        let tileType = tile.getData('tileType');
        tile.destroy();
        //console.log(this);
        this.player.sprite.setVelocity(0);
        this.sidebarScene.input.keyboard.enabled = true;
        this.setAllKeysDownFalse();
        this.input.keyboard.enabled = false;
        this.sidebarScene.pickupTile(tileType);
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

    /*
    /------------------------------\
    | NOTE: The move code is run   |
    |  is run from the Piece object|
    |  To reference the main game  |
    |  use this.scene.mainGameScene|
    \------------------------------/
     */
    bigHit() {
        let x = this.scene.mainGameScene.player.sprite.x;
        let y = this.scene.mainGameScene.player.sprite.y;

        let xOffset=0, yOffset=0;
        switch(this.scene.mainGameScene.lastDirection) {
            case UP:
                yOffset = -205;
                break;

            case RIGHT:
                xOffset = 205;
                break;

            case DOWN:
                yOffset = 205;
                break;

            case LEFT:
                xOffset = -205;
                break;
        }

        this.scene.mainGameScene.player.makeHitbox(x+xOffset, y+yOffset, 400, 50, this.scene.mainGameScene.enemies, this.scene.mainGameScene.player.onBasicAttackHit, this.scene.mainGameScene);
    }

    tripleHit() {
        let x = this.scene.mainGameScene.player.sprite.x;
        let y = this.scene.mainGameScene.player.sprite.y;

        let xOffset = 0, yOffset = 0;
        switch(this.scene.mainGameScene.lastDirection) {
            case UP:
                yOffset = -55;
                break;

            case RIGHT:
                xOffset = 55;
                break;

            case DOWN:
                yOffset = 55;
                break;

            case LEFT:
                xOffset = -55;
                break;
        }

        this.scene.mainGameScene.player.makeHitbox(x+xOffset, y+yOffset, 50, 50, this.scene.mainGameScene.enemies, this.scene.mainGameScene.player.onBasicAttackHit, this.scene.mainGameScene);
        this.scene.mainGameScene.time.delayedCall(200, function() {
            this.player.makeHitbox(x+xOffset*2, y+yOffset*2, 50, 50, this.enemies, this.player.onBasicAttackHit, this);
        }, this.scene.mainGameScene);
        this.scene.mainGameScene.time.delayedCall(400, function() {
            this.player.makeHitbox(x+xOffset*3, y+yOffset*3, 50, 50, this.enemies, this.player.onBasicAttackHit, this);
        }, this.scene.mainGameScene);
    }

    /**
     * Teleport the player some distance in a direction then
     */
    rightBehindYou() {
        let teleportDistance = 200;
        let x = this.scene.mainGameScene.player.x;
        let y = this.scene.mainGameScene.player.y;

        let xPlayerOffset = 0, yPlayerOffset = 0;
        let xOffset = 0, yOffset = 0;
        switch(this.scene.mainGameScene.lastDirection) {
            case UP:
                yOffset = 55;
                yPlayerOffset = -teleportDistance;
                break;

            case RIGHT:
                xOffset = -55;
                xPlayerOffset = teleportDistance;
                break;

            case DOWN:
                yOffset = -55;
                yPlayerOffset = teleportDistance;
                break;

            case LEFT:
                xOffset = 55;
                xPlayerOffset = -teleportDistance;
                break;
        }

        this.scene.mainGameScene.player.x = x+xPlayerOffset;
        this.scene.mainGameScene.player.y = y+yPlayerOffset;

        this.scene.mainGameScene.player.makeHitbox(x+xOffset, y+yOffset, 50, 50, this.scene.mainGameScene.enemies, this.scene.mainGameScene.player.onBasicAttackHit, this.scene.mainGameScene);
    }

    setUpInput() {
        this.input.keyboard.on('keydown', (event) => {
            let digit;
            switch(event.code) {
                case 'Digit1':
                case 'Numpad1':
                    console.log('1 pressed');
                    digit = 1;
                    break;
                case 'Digit2':
                case 'Numpad2':
                    console.log('2 Pressed');
                    digit = 2;
                    break;
                case 'Digit3':
                case 'Numpad3':
                    console.log('3 Pressed');
                    digit = 3;
                    break;
                case 'Digit4':
                case 'Numpad4':
                    console.log('4 Pressed');
                    digit = 4;
                    break;
            }
            if(this.sidebarScene.pieces.length > digit-1) {
                this.sidebarScene.pieces[digit-1].move();
            }

        });
    }

    // updateEnemies() {
    //     this.enemies.children.iterate(this.enemyFindState);
    //     this.enemies.children.iterate(function(child) {
    //         switch(child.getData("state")) {
    //             case "follow":
    //                 this.physics.moveToObject(child, player, enemySpeed);
    //                 break;
    //
    //             case "idle":
    //                 child.setVelocity(0, 0);
    //                 break;
    //             case "attack":
    //                 enemyBasicAttack.call(this, child);
    //                 child.setData("state", "afterAttack");
    //                 child.setVelocity(0, 0);
    //                 console.log("enemy in attack");
    //                 break;
    //             case "afterAttack":
    //                 // After a bit, change back to idle
    //                 let timedEvent = this.time.delayedCall(attackResetTime, function(enemy) {
    //                     enemy.setData("state", "idle");
    //                 }, [child], this);
    //                 child.setData("state", "runAway");
    //                 break;
    //             case "runAway":
    //                 let angle = Phaser.Math.Angle.BetweenPoints(player, child);
    //                 this.physics.velocityFromRotation(angle, enemySpeed);
    //                 break;
    //
    //         }
    //     }, this);
    // }

}