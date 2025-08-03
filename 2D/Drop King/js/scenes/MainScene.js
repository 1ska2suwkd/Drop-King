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

        // 1. 왼쪽 벽
        const leftWall = this.physics.add.staticImage(-5, 300).setSize(10, 600).setOrigin(0, 0.5);
        leftWall.visible = false;
        this.platformGroup.add(leftWall);

        // 2. 오른쪽 벽
        const rightWall = this.physics.add.staticImage(680, 300).setSize(10, 600).setOrigin(1, 0.5);
        rightWall.visible = false;
        this.platformGroup.add(rightWall);

        // 플레이어 생성
        this.controller = new PlayerController(this, 333, 10);
        this.player = this.controller.player;

        // 점수 텍스트
        this.scoreText = this.add.text(10, 10, 'Score: 0', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setScrollFactor(0);

        const initPlatfrom = this.physics.add.staticImage(333, 100, `platform4`);
        initPlatfrom.setScale(0.5).refreshBody();
        this.platformGroup.add(initPlatfrom);
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
            const baseY = 200 + i * platformSpacing; // 200은 y 초기값

            const goodx = Phaser.Math.Between(100, 700);
            const goodIndex = Phaser.Math.Between(1, 7);
            const goodY = baseY - 20;
            //staticImage는 움직이거나 중력의 영향을 받지않는 정적이미지.
            const platform = this.physics.add.staticImage(goodx, goodY, `platform${goodIndex}`);
            platform.setScale(0.5);
            platform.refreshBody();
            this.platformGroup.add(platform);

            if (Phaser.Math.Between(0, 1)) { // 함정발판은 50% 확률로 생성
                const badX = Phaser.Math.Between(100, 700);
                const badIndex = Phaser.Math.Between(1, 7);
                const badY = baseY + 20;
                const trap = this.physics.add.staticImage(badX, badY, `platform${badIndex}`);
                trap.setTint(0xff0000);
                trap.setScale(0.5);
                trap.refreshBody();
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

        this.platformGroup.children.iterate((platform)=>{
            if(platform && platform.y < this.player.y){
                //충돌 그룹에서 제거하고
                this.platformGroup.remove(platform);
                //화면에서도 제거
                platform.destroy();
            }
        });
        this.trapGroup.children.iterate((trap)=>{
            if(trap && trap.y < this.player.y){
                //충돌 그룹에서 제거하고
                this.trapGroup.remove(trap);
                //화면에서도 제거
                trap.destroy();
            }
        });
    }
}
