export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player = null;
    }

    create() {
        this.add.image(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            'background1');

        this.player = this.physics.add.sprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.heigt - 100,
            'player'
        );

        this.anims.create({
            key: 'idle',
            frame: [{start: 0, end: 0}],
            frameRate: 1,
            repeat: -1
        })
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {start: 1, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        //생성하면 idle 재생
        this.player.play('idle'); 
    }
}