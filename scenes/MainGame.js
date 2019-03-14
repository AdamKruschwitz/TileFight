class MainGameScene extends Phaser.Scene {

    constructor() {
        super({
            key: "mainGame",

            physics: {
                arcade: {
                    debug: true
                }
            },

            plugins: [
                'Loader',
                'Input',
                'TweenManager',
                'DataManager',
                'Clock'
            ]
        });
    }

    preload() {
        this.load.image('player', 'assets/black50.png');
    }

    create() {
        this.cameras.main.setViewport(266, 0, 534, 600);
        this.cameras.main.setBackgroundColor({r:255, g:255, b:255, a:255});
        this.physics.add.sprite(50, 50, 'player');
        this.scene.launch('sidebar');
    }
}