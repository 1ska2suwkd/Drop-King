export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player = null;
        this.cursors = null;
        this.jumpPower = 0;
        this.isChargingJump = false;
        this.maxJumpPower = 500;
    }

    create() {
        this.add.image(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            'background1');

        this.player = this.physics.add.sprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - 33,
            'player'
        ).setScale(1.5);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
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
        this.cursors = this.input.keyboard.createCursorKeys();
        //spacekey를 새로 정의하는 이유는 Justup을 사용하기 위함이다.
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // update는 Phaser의 scene 클래스에서 제공하는 함수
    update() {
        if (!this.player || !this.cursors) return;

        const speed = 150;

        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk', true);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }

        //점프 차징
        //this.player.body.bloked.down은 플레이어가 땅에 닿아있는 지 확인하는 것
        if(this.spaceKey.isDown && this.player.body.bloked.down) {
            this.isChargingJump = true;
            this.jumpPower += 10;
            if (this.jumpPower > this.maxJumpPower){
                this.jumpPower = this.maxJumpPower;
            }
            this.player.setFrame(4);
        }

        //점프 발사
        //Justup은 손 뗀 순간을 의미
        if(this.isChargingJump && Phaser.Input.Keyboard.Justup(this.spaceKey)) {
            this.isChargingJump = false;
            this.player.setVelocityY(-this.jumpPower)
            this.jumpPower = 0
            this.player.setFrame(5);
        }

        if(!this.player.body.blocked.down && this.player.body.velocity.y > 0 && !this.isChargingJump) {
            this.player.setFrame(6);
        }
    }

}