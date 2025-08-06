// js/playerController.js

export class PlayerController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.physics.add.sprite(x, y, 'player').setScale(1.5);
        this.cursors = scene.input.keyboard.createCursorKeys();
        //spacekey를 새로 정의하는 이유는 Justup을 사용하기 위함이다.
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.jumpPower = 0;
        this.isChargingJump = false;
        this.isJumping = false;
        this.isDrop = false;
        this.leftJump = false;
        this.rightJump = false;
        this.maxJumpPower = 800;

        this.createAnimations();
        this.player.play('idle');
        this.isDead = false;
    }

    createAnimations() {
        const scene = this.scene;
        const anims = scene.anims;

        anims.create({
            key: 'idle',
            frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'walk',
            frames: anims.generateFrameNumbers('player', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'chargingJump',
            frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'jumpUp',
            frames: anims.generateFrameNumbers('player', { start: 5, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'jumpFall',
            frames: anims.generateFrameNumbers('player', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'end',
            frames: anims.generateFrameNumbers('player', { start: 7, end: 7 }),
            frameRate: 100,
            repeat: -1
        });
    }

    update() {
        if(this.isDead) return;

        const player = this.player;
        const cursors = this.cursors;
        const spaceKey = this.spaceKey;
        const speed = 150;
        const onGround = player.body.touching.down;

        if (onGround) {
            this.isJumping = false;
            this.isDrop = false;

            if (spaceKey.isDown) {
                if (!this.isChargingJump) {
                    this.isChargingJump = true;
                    player.play('chargingJump', true);
                    player.setVelocityX(0); //차지 중에는 이동 정지
                    this.jumpPower = 0;
                    this.leftJump = false;
                    this.rightJump = false;
                }

                if (this.jumpPower < this.maxJumpPower) {
                    this.jumpPower += 20;
                }

                if (cursors.left.isDown) {
                    player.flipX = true;
                    this.leftJump = true;
                    this.rightJump = false;
                } else if (cursors.right.isDown) {
                    player.flipX = false;
                    this.rightJump = true;
                    this.leftJump = false;
                    // 방향키를 안누르면 제자리 점프 준비
                } else {
                    this.leftJump = false;
                    this.rightJump = false;
                }

            } else {// 스페이스바를 누르고 있지 않을 때
                // 차지 중이었다면 점프 실행
                if (this.isChargingJump) {
                    this.isChargingJump = false;
                    this.isJumping = true;
                    // 수직 점프 실행
                    player.setVelocityY(-this.jumpPower);

                    const jumpHorizontalSpeed = 200;
                    if (this.leftJump) {
                        player.setVelocityX(-jumpHorizontalSpeed);
                    } else if (this.rightJump) {
                        player.setVelocityX(jumpHorizontalSpeed);
                    } else {
                        player.setVelocityX(0);
                    }
                } else {
                    // 일반 이동 (차지하지 않았을 때)
                    if (cursors.left.isDown) {
                        player.setVelocityX(-speed);
                        player.flipX = true;
                        player.play('walk', true);
                    } else if (cursors.right.isDown) {
                        player.setVelocityX(speed);
                        player.flipX = false;
                        player.play('walk', true);
                    } else {
                        player.setVelocityX(0);
                        player.play('idle', true);
                    }
                }
            }
        }

        if (!onGround) {
            // if (spaceKey.isDown && !this.isDrop) {
            //     player.setVelocityX(0);
            //     player.setVelocityY(150);
            //     this.isDrop = true;
            // }

            if (player.body.velocity.y < 0) {
                player.play('jumpUp', true);
            } else if (player.body.velocity.y > 0) {
                player.play('jumpFall', true);
            }
        }
    }
}
