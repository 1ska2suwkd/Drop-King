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
    }

    update() {
        this.controller.update();
    }
}