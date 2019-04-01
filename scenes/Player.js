class Player {
    health;
    scene;
    sprite;
    move1;
    move2;
    move3;
    move4;
    basicAttack;

    constructor(scene, spriteFileName, startingHealth) {
        this.scene = scene;
        this.health = startingHealth;
        this.sprite = this.scene.physics.add.sprite(50, 50, 'player');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDataEnabled();
        this.sprite.setData('parent', this);
        this.basicAttack = this.playerBasicAttack;
    }

    playerBasicAttack() {
        console.log("basic attack");
        // TODO - implement basic attack
        let xOffset = 0;
        let yOffset = 0;
        switch(this.scene.lastDirection) {
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

        this.makeHitbox(this.sprite.x + xOffset, this.sprite.y + yOffset, 50, 500, this.scene.enemies, this.onBasicAttackHit, this.scene);

    }

    makeHitbox(x, y, size, time, object, callback, context) {
        console.log("Making Hitbox");
        let hitbox = this.scene.add.zone(x, y).setSize(size, size, true);
        hitbox.setOrigin();
        this.scene.physics.world.enable(hitbox);
        hitbox.setDataEnabled();
        hitbox.setData("alreadyHit", []);
        this.scene.physics.add.overlap(hitbox, object, callback, function() {return true}, context);

        // Destroy the hitbox after a delay
        this.scene.time.delayedCall(time, function(hitbox) {
            hitbox.destroy()
        }, [hitbox], this);
    }

    onBasicAttackHit(hitbox, object) {
        if(!hitbox.getData("alreadyHit").includes(object)) {
            console.log("enemy hit");
            object.getData('parent').health -= 1;
            if(object.getData('parent').health <= 0) {
                this.makeTilePickUp(0, object.x, object.y);
                object.destroy();
            }
            hitbox.getData("alreadyHit").push(object);
        }
    }
}