const IDLE = 0,
    FOLLOW = 1,
    BEFOREATTACK = 2,
    ATTACK = 3,
    AFTERATTACK = 4,
    RUNAWAY = 5;

class Enemy {
    sprite;
    move;
    health;
    canMove;
    state;
    enemies;
    scene;
    followThreshold = 200;
    attackThreshold = 60;
    enemySpeed = 200;



    constructor(scene, enemies, spriteFileName, startingHealth, x, y) {
        this.scene = scene;
        this.enemies = enemies;
        this.sprite = this.enemies.create(x, y, spriteFileName);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDataEnabled();
        this.sprite.setData('parent', this);
        this.health = startingHealth;
    }

    findState() {
        if(Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y) < this.followThreshold) {
            if(Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y) < this.attackThreshold) {
                if(this.state == FOLLOW) {
                    this.state = BEFOREATTACK;
                    // attack and set after attack
                    this.scene.time.delayedCall(200, function () {
                        console.log('afterAttackStarted');
                        this.state = AFTERATTACK;
                        this.attack();

                        // Set runaway
                        this.scene.time.delayedCall(200, function () {
                            console.log('runaway started');
                            this.state = RUNAWAY;

                            // Set idle
                            this.scene.time.delayedCall(200, function () {
                                console.log('returned to idle');
                                this.state = IDLE;
                            }, [], this);
                        }, [], this);
                    }, [], this);
                }
            }
            else {
                this.state = FOLLOW;
            }
        }
        else {
            this.state = IDLE;
        }

    }

    attack() {

        let relativeDistanceX = this.scene.player.sprite.x - this.sprite.x;
        let relativeDistanceY = this.scene.player.sprite.y - this.sprite.y;
        let direction = -1; // Up = 0, Right = 1, Down = 2, Left = 3

        if(Math.abs(relativeDistanceX) < Math.abs(relativeDistanceY)) { // Either Up or Down
            if(relativeDistanceY < 0) { // Up
                direction = UP;
            }
            else { // Down
                direction = DOWN;
            }
        } else { // Either left or Right
            if(relativeDistanceX > 0) { // Right
                direction = RIGHT;
            }
            else {
                direction = LEFT;
            }
        }

        // Make a hitbox in the direction of the player
        let hitboxOffsetX = 0;
        let hitboxOffsetY = 0;
        switch(direction) {
            case UP:
                hitboxOffsetY = -50;
                break;
            case RIGHT:
                hitboxOffsetX = 50;
                break;
            case DOWN:
                hitboxOffsetY = 50;
                break;
            case LEFT:
                hitboxOffsetX = -50;
                break;
        }
        this.scene.player.makeHitbox(this.sprite.x+hitboxOffsetX, this.sprite.y+hitboxOffsetY, 50, 200, this.scene.player.sprite, this.onAttackHit, this.scene);
    }

    updateEnemy() {
        this.findState();

        switch(this.state) {
            case BEFOREATTACK:
            case AFTERATTACK:
            case IDLE:
                this.sprite.setVelocity(0, 0);
                break;

            case FOLLOW:
                this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite);

        }
    }

    onAttackHit(hitbox, player) {
        if(!hitbox.getData("alreadyHit").includes(player)) {
            console.log("player hit");
            player.getData('parent').health -= 1;
            hitbox.getData("alreadyHit").push(player);
        }
    }

}
