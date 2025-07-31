export default class PreloadScene extends Phaser.Scene{
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('StartBackground', 'assets/StartScene.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('IntroBackground', 'assets/IntroScene.png');
        this.load.image('title', 'assets/title.png');
        this.load.spritesheet('player', 'assets/player.png',{
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        this.scene.start('StartScene');
    }
}
