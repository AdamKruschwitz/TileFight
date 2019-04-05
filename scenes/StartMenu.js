class StartMenu extends Phaser.Scene {

    space;
    spacePressed = false;

    create() {
        this.space = this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.text(0, 0, 'Press Space to play game');
    }

    update() {
        if(this.space.isDown && !this.spacePressed) {
            this.scene.start('mainGame');
            this.scene.start('sidebar');
            this.input.keyboard.enabled = false;
            this.spacePressed = true;
        }
    }


}