class GameOver extends Phaser.Scene {

    constructor() {
        super({
            key: "gameOver",
        });
    }

    create() {

        this.add.text(0, 0, 'GAME OVER');
        this.cameras.main.setViewport(0, 0, 800, 600);
        this.scene.bringToTop();

    }

}
