export default class PreloadScene extends Phaser.Scene{
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('background1', 'assets/background1.png');
        this.load.spritesheet('player', 'assets/player.png',{
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        this.scene.start('MainScene');
    }
}