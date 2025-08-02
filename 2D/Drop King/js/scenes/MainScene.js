import { PlayerController } from "../playerController.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.background = this.add.image(0, 0, 'background1').setOrigin(0, 0).setScale(2.15);

        // 점수 초기화
        this.score = 0;

        // 발판 그룹 생성
        this.platformGroup = this.physics.add.staticGroup();
        this.trapGroup = this.physics.add.staticGroup();

        // 플레이어 생성
        this.controller = new PlayerController(this, 400, 100);
        this.player = this.controller.player;

        // 점수 텍스트
        this.scoreText = this.add.text(10, 10, 'Score: 0', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setScrollFactor(0);

        // 발판 생성
        this.spawnPlatforms();

        // 충돌 처리
        this.physics.add.collider(this.player, this.platformGroup, this.hitPlatform, null, this);
        this.physics.add.collider(this.player, this.trapGroup, this.hitTrap, null, this);

        this.backgroundChanged = false;
    }

    spawnPlatforms() {
        const platformSpacing = 150;
        const totalLayers = 30;

        for (let i = 0; i < totalLayers; i++) {
            const y = 200 + i * platformSpacing;

            // 올바른 발판
            const x = Phaser.Math.Between(100, 700);
            const goodIndex = Phaser.Math.Between(1, 7);
            const platform = this.physics.add.staticImage(x, y, `platform${goodIndex}`);
            this.platformGroup.add(platform);

            // 함정 발판 (50% 확률)
            if (Phaser.Math.Between(0, 1)) {
                const tx = Phaser.Math.Between(100, 700);
                const badIndex = Phaser.Math.Between(1, 7);
                const trap = this.physics.add.staticImage(tx, y + 10, `platform${badIndex}`);
                trap.setTint(0xff0000);
                this.trapGroup.add(trap);
            }
        }
    }

    hitPlatform(player, platform) {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
        // this.platformGroup.remove(platform);
        // platform.destroy(); // 다시 점수 못 얻게 제거

        // 점수가 500 이상이 되었고 배경이 아직 바뀌지 않았다면 교체
        if (this.score >= 500 && !this.backgroundChanged) {
            this.background.setTexture('background2');
            this.backgroundChanged = true;
        }
    }

    hitTrap(player, trap) {
        // 함정에 닿으면 바로 게임오버
        // this.scene.start('GameOverScene');
    }

    update() {
        this.controller.update();
    }
}
