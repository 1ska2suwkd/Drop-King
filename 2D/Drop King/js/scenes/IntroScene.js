import { PlayerController } from "../playerController.js";
export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        //충돌 영역이 있는 배경 생성하기
        this.add.image(80, -25, 'IntroBackground').setOrigin(0, 0);

        this.physics.world.gravity.y = 5;

        // 플레이어가 하늘에서 떨어지는 것처럼 보이게 하기 위해서 10으로 설정   
        this.controller = new PlayerController(this, 400, 10);
        this.controller.player.flipX = true;

        const title = this.add.image(400, 200, 'title')
            .setOrigin(0.5)
            .setScale(0.4)
            .setAlpha(0); // 투명

        // 10초에 걸쳐 알파값을 1로 천천히 증가시킴
        this.tweens.add({
            targets: title,
            alpha: 2,
            duration: 10000,
            ease: 'Sine.easeInOut'
        });
        
        this.cameras.main.zoomTo(1.2, 10000);
    }

    update() {
        this.controller.update();

        if (this.controller.player.y > 650) {
            this.scene.start('StartScene');
        }
    }
}