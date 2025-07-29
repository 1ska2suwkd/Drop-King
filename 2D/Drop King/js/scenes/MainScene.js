export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player = null;
        this.cursors = null;
        this.jumpPower = 0;
        this.isChargingJump = false;
        this.isJumping = false;
        this.isDrop = false;
        this.leftJump = false;
        this.rightJump = false;
        this.maxJumpPower = 800;
    }

    create() {
        //충돌 영역이 있는 배경 생성하기
        const map = this.make.tilemap({ key: 'map' });
        this.add.image(88, -25, 'background1').setOrigin(0, 0);

        this.ground = this.physics.add.staticGroup();

        const groundLayer = map.getObjectLayer('collision');

        if (groundLayer && groundLayer.objects) {
            groundLayer.objects.forEach(obj => {
                const rect = this.add.rectangle(
                    obj.x + obj.width,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height,
                );
                this.physics.add.existing(rect, true); // true → static body
                this.ground.add(rect);
            });
        }

        //플레이어, 애니메이션 생성
        this.player = this.physics.add.sprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height - 100,
            'player'
        ).setScale(1.5);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'chargingJump',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jumpUp',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jumpFall',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        //생성하면 idle 재생
        this.player.play('idle');

        this.ground.getChildren().forEach(groundObj => {
            this.physics.add.collider(this.player, groundObj);
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        //spacekey를 새로 정의하는 이유는 Justup을 사용하기 위함이다.
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // update는 Phaser의 scene 클래스에서 제공하는 함수
    update() {
        if (!this.player || !this.cursors) return;

        const speed = 150;
        const onGround = this.player.body.touching.down;

        if (onGround) {
            this.isJumping = false;
            this.isDrop = false;

            if (this.spaceKey.isDown) {
                if (!this.isChargingJump) {
                    this.isChargingJump = true;
                    this.player.play('chargingJump', true);
                    this.player.setVelocityX(0); // 차지 중에는 이동 정지
                    this.jumpPower = 0;
                    this.leftJump = false;  
                    this.rightJump = false; 
                }

                if (this.jumpPower < this.maxJumpPower) {
                    this.jumpPower += 20;
                }

                if (this.cursors.left.isDown) {
                    this.player.flipX = true;
                    this.leftJump = true;
                    this.rightJump = false;
                } else if (this.cursors.right.isDown) {
                    this.player.flipX = false;
                    this.rightJump = true;
                    this.leftJump = false;
                } else {
                    // 방향키를 안누르면 제자리 점프 준비
                    this.leftJump = false;
                    this.rightJump = false;
                }

            } else { // 스페이스바를 누르고 있지 않을 때
                // 차지 중이었다면 점프 실행
                if (this.isChargingJump) {
                    this.isChargingJump = false;
                    this.isJumping = true;

                    // 수직 점프 실행
                    this.player.setVelocityY(-this.jumpPower);

                    const jumpHorizontalSpeed = 200;
                    if (this.leftJump) {
                        this.player.setVelocityX(-jumpHorizontalSpeed);
                    } else if (this.rightJump) {
                        this.player.setVelocityX(jumpHorizontalSpeed);
                    } else {
                        this.player.setVelocityX(0);
                    }
                } else {
                    // 일반 이동 (차지하지 않았을 때)
                    if (this.cursors.left.isDown) {
                        this.player.setVelocityX(-speed);
                        this.player.flipX = true;
                        this.player.play('walk', true);
                    } else if (this.cursors.right.isDown) {
                        this.player.setVelocityX(speed);
                        this.player.flipX = false;
                        this.player.play('walk', true);
                    } else {
                        this.player.setVelocityX(0);
                        this.player.play('idle', true);
                    }
                }
            }
        }

        if (!onGround) {
            const drop = 150

            if (this.spaceKey.isDown && !this.isDrop) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(drop);
                this.isDrop = true;
            }

            if (this.player.body.velocity.y < 0) { // player.body.velocity.y 는 palyer의 y를 기준으로 상승 하강을 구분
                this.player.play('jumpUp', true);
            } else if (this.player.body.velocity.y > 0) {
                this.player.play('jumpFall', true);
            }
        }
    }
}