class Enemy {
    sprite;
    move;
    health;
    canMove;
    enemies;
    scene;

    constructor(scene, enemies, spriteFileName, startingHealth, x, y) {
        this.scene = scene;
        this.enemies = enemies;
        this.sprite = this.enemies.create(x, y, spriteFileName);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDataEnabled();
        this.sprite.setData('parent', this);
        this.health = startingHealth;
    }

}
