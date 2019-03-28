class SidebarScene extends Phaser.Scene {

    takeInput = false;

    constructor() {
        super({
            key: "sidebar",

            plugins: [
                'Loader',
                'Input',
                'TweenManager',
                'DataManager'
            ]
        });
    }

    preload() {
        this.load.image('sidebarBackground', 'assets/sidebar.png');
    }

    create() {
        // Set camera size and position
        this.cameras.main.setViewport(0, 0, 266, 600);
        this.cameras.main.setBackgroundColor({r:200, g:200, b:200, a:255});
        this.scene.bringToTop();
        this.add.sprite(0, 0, 'sidebarBackground').setOrigin(0);
    }

    update() {
        if(this.takeInput) this.takePlayerInput();
    }

    takePlayerInput() {
        //TODO - take input to move tile
    }

    pickupTile(tileType) {
        //TODO - implement tile type
    }

    disableInput() {
        console.log("disabling input from Sidebar");
        this.takeInput = false;
    }

    enableInput() {
        console.log("enabling input from sidebar");
        this.takeInput = true;
    }
}