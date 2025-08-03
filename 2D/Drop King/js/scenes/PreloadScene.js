export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('StartBackground', 'assets/Scene/StartScene.png');
        this.load.tilemapTiledJSON('map', 'assets/Scene/map.json');
        this.load.image('IntroBackground', 'assets/Scene/IntroScene.png');
        this.load.image('title', 'assets/title.png');
        for (let i = 1; i <= 7; i++) {
            this.load.image(`platform${i}`, `assets/platforms/platform${i}.png`);
        }for (let i = 1; i <= 15; i++) {
            this.load.image(`background${i}`, `assets/Scene/background/background${i}.png`);
        }

        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // this.scene.start('StartScene');
        this.scene.start('MainScene');
    }
}
