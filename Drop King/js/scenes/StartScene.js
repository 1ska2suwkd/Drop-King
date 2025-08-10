import { PlayerController } from "../playerController.js";

class ProximityPopup extends Phaser.GameObjects.Container {
    constructor(scene, x, y, textureKey, message, opts = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.opts = Object.assign({
            showRadius: 180,   // 이 거리 안: 썸네일 등장
            revealRadius: 90,  // 이 거리 안: 크게 + 텍스트 표시
            hideRadius: 180,   // 이 거리 밖: 전부 숨김
            thumbScale: 0.4,   // 썸네일 크기
            fullScale: 0.4,    // 확대 크기
            tweenTime: 220     // 트윈 시간(ms)
        }, opts);

        this.img = scene.add.image(0, 0, textureKey)
            .setScale(0.001)
            .setAlpha(0)
            .setOrigin(0.5);

        const style = {
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '14px',
            align: 'center',
            resolution: 2,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            wordWrap: { width: 260, useAdvancedWrap: true }
        };

        // 이미지 아래쪽에 메시지
        this.msg = scene.add.text(0, this.img.height / 2 + 16, message, style)
            .setOrigin(0.5, 0)
            .setAlpha(0);

        this.add([this.img, this.msg]);
        this.setDepth(1000);
        this.state = 'hidden'; // 'hidden' | 'thumb' | 'open'
    }

    update(player) {
        // 화면 바깥이면 스킵(약간의 성능 이득)
        const cam = this.scene.cameras.main;
        if (!Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), cam.worldView)) return;

        const d = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
        if (this.state === 'hidden' && d < this.opts.showRadius) {
            this.#toThumb();
        } else if (this.state === 'thumb') {
            if (d < this.opts.revealRadius) this.#toOpen();
            else if (d > this.opts.hideRadius) this.#toHidden();
        } else if (this.state === 'open') {
            if (d > this.opts.hideRadius) this.#toHidden();
        }
    }

    getBounds() {
        const r = Math.max(this.opts.hideRadius, 120);
        return new Phaser.Geom.Rectangle(this.x - r, this.y - r, r * 2, r * 2);
    }

    #killTweens() {
        this.scene.tweens.killTweensOf(this.img);
        this.scene.tweens.killTweensOf(this.msg);
    }
    #toHidden() {
        this.#killTweens();
        this.state = 'hidden';
        this.scene.tweens.add({
            targets: [this.img, this.msg],
            alpha: 0,
            duration: this.opts.tweenTime,
            onComplete: () => this.img.setScale(0.001)
        });
    }
    #toThumb() {
        this.#killTweens();
        this.state = 'thumb';
        this.img.setAlpha(0);
        this.img.setScale(0.001);
        this.msg.setAlpha(0);
        this.scene.tweens.add({
            targets: this.img,
            alpha: 0.85,
            scale: this.opts.thumbScale,
            duration: this.opts.tweenTime
        });
    }
    #toOpen() {
        this.#killTweens();
        this.state = 'open';
        this.scene.tweens.add({
            targets: this.img,
            alpha: 1,
            scale: this.opts.fullScale,
            duration: this.opts.tweenTime
        });
        this.scene.tweens.add({
            targets: this.msg,
            alpha: 1,
            duration: this.opts.tweenTime
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

        // === [ADD] 거리 팝업들 ===
        // 위치(x,y)와 메시지는 원하는 곳으로 바꿔서 쓰면 됨.
        this.popups = [
            new ProximityPopup(this, 480, 310, 'controls',),
        ];
    }

    update() {
        const cursors = this.controller.cursors;
        const spaceKey = this.controller.spaceKey;

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
