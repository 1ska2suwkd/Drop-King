export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Orbitron 로드
        this.load.addFile(new class extends Phaser.Loader.File {
            constructor(loader) {
                super(loader, { type: 'webfont', key: 'Orbitron' });
            }
            load() {
                WebFont.load({
                    google: { families: ['Orbitron:400,700'] },
                    active: () => this.loader.nextFile(this, true),
                    inactive: () => this.loader.nextFile(this, false)
                });
            }
        }(this.load));

        this.load.image('StartBackground', 'assets/Scene/StartScene.png');
        this.load.tilemapTiledJSON('map', 'assets/Scene/map.json');
        this.load.image('IntroBackground', 'assets/Scene/IntroScene.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('controls', 'assets/controls.png');
        this.load.image('gameOver', 'assets/gameOver.png');
        this.load.image('gameClear', 'assets/gameClear.png');
        this.load.image('timeOver', 'assets/timeOver.png');
        for (let i = 1; i <= 7; i++) {
            this.load.image(`platform${i}`, `assets/platforms/platform${i}.png`);
        } for (let i = 1; i <= 15; i++) {
            this.load.image(`background${i}`, `assets/Scene/background/background${i}.png`);
        }

        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // this.scene.start('StartScene');

        // this.scene.start('MainScene');
        this.scene.start('GameOverScene');
        // this.scene.start('GameClearScene');
    }
}
