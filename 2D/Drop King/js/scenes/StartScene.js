import { PlayerController } from "../playerController.js";
export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        //충돌 영역이 있는 배경 생성하기
        const map = this.make.tilemap({ key: 'map' });
        this.add.image(80, -25, 'StartBackground').setOrigin(0, 0);

        this.ground = this.physics.add.staticGroup();

        const groundLayer = map.getObjectLayer('collision');

        if (groundLayer && groundLayer.objects) {
            groundLayer.objects.forEach(obj => {
                const rect = this.add.rectangle(
                    obj.x + 80 + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height,
                );
                this.physics.add.existing(rect, true); // true → static body
                this.ground.add(rect);
            });
        }

        this.controller = new PlayerController(this, 400, 300);
        this.physics.add.collider(this.controller.player, this.ground);
    }

    // update는 Phaser의 scene 클래스에서 제공하는 함수
    update() {
        this.controller.update();
        //텐트 안으로 떨어지면 인트로 씬으로 변경
        if (this.controller.player.y > 650) {
            this.scene.start('IntroScene');
        }
    }
}