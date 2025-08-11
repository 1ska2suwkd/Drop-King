import { PlayerController } from "../playerController.js";

class ProximityPopup extends Phaser.GameObjects.Container {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y);
        scene.add.existing(this);

        this.openRadius = 180;      // 보이는 범위
        this.hideRadius = 180;      // 숨김 범위
        this.fullScale = 0.4;       // 크기
        this.tweenTime = 220;       // 트윈 시간(ms)

        this.img = scene.add.image(0, 0, textureKey)
            .setScale(0.001)
            .setAlpha(0)
            .setOrigin(0.5);


        this.add(this.img);
        this.setDepth(1000);
        this.state = 'hidden'; // 'hidden' | 'open'
    }

    update(player) {
        // 화면 바깥이면 스킵(약간의 성능 이득)
        const cam = this.scene.cameras.main;
        if (!Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), cam.worldView)) return;

        const d = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
        if (this.state === 'hidden' && d < this.openRadius) {
            this.#toOpen();
        } else if (this.state === 'open' && d > this.hideRadius) {
            this.#toHidden();
        }
    }

    getBounds() {
        const r = Math.max(this.hideRadius, 120);
        return new Phaser.Geom.Rectangle(this.x - r, this.y - r, r * 2, r * 2);
    }

    #killTweens() {
        this.scene.tweens.killTweensOf(this.img);
    }

    #setState(state){
        this.#killTweens();
        this.state = state;
    }

    #toHidden() {
        this.#setState('hidden');
        this.scene.tweens.add({
            targets: this.img,
            alpha: 0,
            duration: this.tweenTime,
            onComplete: () => this.img.setScale(0.001)
        });
    }
    #toOpen() {
        this.#setState('open');
        this.scene.tweens.add({
            targets: this.img,
            alpha: 1,
            scale: this.fullScale,
            duration: this.tweenTime
        });
    }
}

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
        this.start = true
    }

    create() {

        // 충돌 영역이 있는 배경 생성하기
        const map = this.make.tilemap({ key: 'map' });
        this.add.image(0, 0, 'StartBackground').setOrigin(0, 0);

        this.ground = this.physics.add.staticGroup();

        const groundLayer = map.getObjectLayer('collision');
        if (groundLayer && groundLayer.objects) {
            groundLayer.objects.forEach(obj => {
                const rect = this.add.rectangle(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );
                this.physics.add.existing(rect, true); // true → static body
                this.ground.add(rect);
            });
        }

        // 플레이어
        this.controller = new PlayerController(this, 333, 433);
        this.physics.add.collider(this.controller.player, this.ground);

        // 위치(x,y)와 메시지는 원하는 곳으로 바꿔서 쓰면 됨.
        this.popups = [
    new ProximityPopup(this, 480, 310, 'controls'),
    // new ProximityPopup(this, x, y, '다른텍스처')
  ];
    }

    update() {
        const cursors = this.controller.cursors;

        if (this.start) {
            this.controller.player.play('end', true);
            if (cursors.left.isDown || cursors.right.isDown) {
                this.start = false;
            }
            return;
        }
        this.controller.update();


        // [ADD] 팝업 업데이트
        const player = this.controller.player;
         if (this.popups) {
    for (let i = 0; i < this.popups.length; i++) {
        this.popups[i].update(player);
    }
}

        // 텐트 안으로 떨어지면 인트로 씬으로 변경
        if (player.y > 650) {
            this.scene.start('IntroScene');
        }
    }
}
