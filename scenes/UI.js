class UI extends Phaser.Scene {

    icons = [];
    cdOverlays = [];

    iconsGroup;
    cdOverlaysGroup;

    mainGame;
    sidebarScene;

    constructor() {
        super({
            key: "UI"
        });
    }

    preload() {
        this.load.image('noMove', 'assets/NoMove.png');
        this.load.image('bigHit', 'assets/bigHit.png');
        this.load.image('tripleHit', 'assets/MultiHit.png');
        this.load.image('rightBehindYou', 'assets/NothingPersonal.png');
        this.load.image('cdOverlay', 'assets/cdOverlay.png');
    }

    create() {

        this.iconsGroup = this.add.group({
            key: 'noMove',
            repeat: 4,
            setScale: { x: 1, y:1 }
        });

        this.cdOverlaysGroup = this.add.group({
            key: 'cdOverlay',
            repeat: 4,
            setScale: { x:1, y:0 }
        });

        let startX = 360;
        let betweenX = 120;
        let yy = 530;
        for(let i=0; i<4; i++) {
            this.icons.push(this.add.image(startX + i * betweenX, yy, 'noMove'));
            this.cdOverlays.push(this.add.image(startX + i * betweenX, yy, 'cdOverlay'));
            this.cdOverlays[this.cdOverlays.length-1].scaleY = 0;
        }

        this.mainGame = this.scene.get('mainGame');
        this.sidebarScene = this.scene.get('sidebar');

        this.mainGame.events.on('moveUsed', function(args) {
            let digit = args[0];
            let cooldown = args[1];
            this.tweens.add({
                targets: this.cdOverlays[digit-1],
                props: {
                    scaleY: { value: 1, duration: cooldown, ease: 'Linear'}
                },

                onComplete: function() {
                    this.sidebarScene.pieces[digit-1].onCooldown = false;
                    this.cdOverlays[digit-1].scaleY = 0;
                },

                onCompleteScope: this

            });

        }, this);
    }

}