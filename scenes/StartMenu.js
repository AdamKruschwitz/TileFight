class StartMenu extends Phaser.Scene {

    space;
    spacePressed = false;

    constructor() {
        super({
            key: "startMenu"

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

    create() {
        this.space = this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.text(0, 0, 'Press Space to play game');
    }

    update() {
        if(this.space.isDown && !this.spacePressed) {
            this.scene.start('mainGame');
            this.scene.start('sidebar');
            this.scene.start('UI');
            this.input.keyboard.enabled = false;
            this.spacePressed = true;
        }
    }


}