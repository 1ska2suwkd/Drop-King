import { PlayerController } from "../playerController.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.isPreviewing = false;
        this.platformSpacing = 150;
        this.totalLayers = 10;
        this.lastPlatformLevel = 0;
        this.currentPlatform = null;
        this.elapsedTime = 0;
        this.timerStarted = false;
        this.remainingTime = 60;
        this.firstPlatformRemoved = false;
    }

    create() {
        this.backgroundIndex = 1;
        this.totalBackgrounds = 15;
        this.backgroundHeight = 500; // 배경 하나 높이
        this.backgrounds = [];

        this.initBackgrounds(); // 초기 배경 3장 정도 그려놓기

        // 점수 초기화
        this.score = 0;
        //타이머
        this.timerText = this.add.text(10, 35, '01:00', {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setScrollFactor(0).setDepth(5);
        //카메라
        this.camera = this.cameras.main;
        this.currentCameraLevel = 0; // 현재 카메라 층
        this.camera.setBounds(0, 0, 666, 30000) // 여기 수정 필요

        // 발판 그룹 생성
        this.platformGroup = this.physics.add.staticGroup();
        this.trapGroup = this.physics.add.staticGroup();
        this.wallGroup = this.physics.add.staticGroup();

        // 1. 왼쪽 벽
        const leftWall = this.physics.add.staticImage(-2, 300).setSize(10, 1500).setOrigin(0, 0.5);
        leftWall.visible = false;
        this.wallGroup.add(leftWall);

        // 2. 오른쪽 벽
        const rightWall = this.physics.add.staticImage(670, 300).setSize(10, 1500).setOrigin(1, 0.5);
        rightWall.visible = false;
        this.wallGroup.add(rightWall);

        // 플레이어 생성
        this.controller = new PlayerController(this, 333, 10);
        this.player = this.controller.player;

        // 점수 텍스트
        this.scoreText = this.add.text(10, 10, 'Score: 0', {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setScrollFactor(0).setDepth(5);

        this.initPlatform = this.physics.add.staticImage(333, 100, `platform4`);
        this.initPlatform.setScale(0.5).refreshBody();
        this.platformGroup.add(this.initPlatform);
        this.nextPlatformY = this.player.y + 200

        // 충돌 처리
        this.physics.add.collider(this.player, this.wallGroup, null, null, this);
        this.physics.add.collider(this.player, this.platformGroup, this.hitPlatform, null, this);
        this.physics.add.collider(this.player, this.trapGroup, this.hitTrap, null, this);

        this.lookDownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        this.controller.update();
        const playerY = this.player.y;
        const cameraHeight = this.camera.height;
        //플레이어가 한 층 아래로 내려갔는 지 확인
        const newLevel = Math.floor(playerY / cameraHeight);

        while (this.nextPlatformY - this.player.y <= this.camera.height * 2) {
            this.spawnPlatforms(this.nextPlatformY);
            this.nextPlatformY += 150 * 10; // 플랫폼 간격 * 개수
        }

        if (newLevel > this.currentCameraLevel) {
            this.currentCameraLevel = newLevel;
            this.camera.scrollY += 500;

            this.addNextBackground();
            this.addNextWalls();
        }
        if (this.lookDownKey.isDown && !this.isPreviewing) {
            this.camera.scrollY += 500;
            this.isPreviewing = true;
        }
        if (Phaser.Input.Keyboard.JustUp(this.lookDownKey) && this.isPreviewing) {
            this.camera.scrollY -= 500;
            this.isPreviewing = false;
        }

        this.platformGroup.children.iterate((platform) => {
            if (platform && platform.y < this.player.y) {
                //충돌 그룹에서 제거하고
                this.platformGroup.remove(platform);
                //화면에서도 제거
                platform.destroy();
                if (!this.firstPlatformRemoved) {
                    this.firstPlatformRemoved = true;
                    this.timerStarted = true;
                }
            }
        });
        this.trapGroup.children.iterate((trap) => {
            if (trap && trap.y < this.player.y) {
                //충돌 그룹에서 제거하고
                this.trapGroup.remove(trap);
                //화면에서도 제거
                trap.destroy();
            }
        });
        if (this.currentPlatform) {
            const isStillTouching = this.player.body.touching.down;

            if (!isStillTouching) {
                this.platformGroup.remove(this.currentPlatform);
                this.currentPlatform.destroy();
                this.currentPlatform = null;
                if (!this.firstPlatformRemoved) {
                    this.firstPlatformRemoved = true;
                    this.timerStarted = true;
                }
            }
        }

        if (this.timerStarted) {
    this.remainingTime -= this.game.loop.delta / 1000;

    const totalSeconds = Math.max(0, Math.floor(this.remainingTime));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    this.timerText.setText(`${minutes}:${seconds}`);

    if (this.remainingTime <= 0) {
        this.timerStarted = false;
        this.remainingTime = 0;

        this.endGame(timeOverScene);
    }
}
    }

    endGame(targetScene){
        if (this.controller.isDead) return; //이미 죽었으면 실행 X

        this.controller.isDead = true;
        this.player.setVelocityX(0);
        this.player.play('end', true);
        this.time.delayedCall(500, () => {
            this.cameras.main.fadeOut(5000, 0, 0, 0); // 1초간 페이드 아웃

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(targetScene);
            });
        });
    }

    spawnPlatforms(startY) {
        for (let i = 0; i < this.totalLayers; i++) {
            const baseY = startY + i * this.platformSpacing;

            const goodx = Phaser.Math.Between(0, 666);
            const goodIndex = Phaser.Math.Between(1, 7);
            const goodY = baseY - 20;

            const platform = this.physics.add.staticImage(goodx, goodY, `platform${goodIndex}`);
            platform.setScale(0.5);
            platform.refreshBody();
            platform.setData('scored', false);
            this.platformGroup.add(platform);

            if (Phaser.Math.Between(0, 1)) {
                const badX = Phaser.Math.Between(0, 666);
                const badIndex = Phaser.Math.Between(1, 7);
                const badY = baseY + 30;
                const trap = this.physics.add.staticImage(badX, badY, `platform${badIndex}`);
                trap.setTint(0xff0000);
                trap.setScale(0.5);
                trap.refreshBody();
                this.trapGroup.add(trap);
            }
        }
    }

    hitPlatform(player, platform) {
        if (platform.getData('scored') || platform == this.initPlatform) {
            return;
        }
        platform.setData('scored', true);
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        this.currentPlatform = platform;
    }

    hitTrap(player, trap) {
        this.endGame('GameOverScene');
    }

    initBackgrounds() {
        for (let i = 0; i < 3; i++) {
            const key = `background${this.backgroundIndex}`;
            const bg = this.add.image(0, i * this.backgroundHeight, key)
                .setOrigin(0, 0)
                .setDepth(-1)
                .setScrollFactor(1);
            this.backgrounds.push(bg);
            this.backgroundIndex = this.getNextBackgroundIndex();
        }
    }

    addNextBackground() {
        const key = `background${this.backgroundIndex}`;
        const yPos = this.backgrounds.length * this.backgroundHeight;

        const bg = this.add.image(0, yPos, key)
            .setOrigin(0, 0)
            .setDepth(-1)
            .setScrollFactor(1);

        this.backgrounds.push(bg);
        this.backgroundIndex = this.getNextBackgroundIndex();
    }
    addNextWalls() {
        const wallHeight = 600;
        const wallY = (this.currentCameraLevel + 1) * this.camera.height + wallHeight / 2;

        const leftWall = this.physics.add.staticImage(-2, wallY).setSize(10, wallHeight).setOrigin(0, 0.5);
        leftWall.visible = false;
        this.wallGroup.add(leftWall);

        const rightWall = this.physics.add.staticImage(670, wallY).setSize(10, wallHeight).setOrigin(1, 0.5);
        rightWall.visible = false;
        this.wallGroup.add(rightWall);
    }

    getNextBackgroundIndex() {
        return this.backgroundIndex % this.totalBackgrounds + 1;
    }
}