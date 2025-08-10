import { baseTextStyle } from "../ui/TextStyles.js";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        const centerX = this.cameras.main.width / 2;
        let current = Number(data?.score ?? 0);
        const image = String(data.image);
        const best = Number(localStorage.getItem('bestScore') || 0);

        this.add.image(centerX + 10, 140, image)
            .setOrigin(0.5)
            .setScale(0.5);

        // Best Score (노란색)
        this.add.text(
            centerX, 260, `Best Score\n${best}`,
            baseTextStyle('#FFD700', '25px')
        ).setOrigin(0.5).setLineSpacing(6);

        // Score (흰색)
        const scoreText = this.add.text(
            centerX, 350, `Score\n${current}`,
            baseTextStyle('#FFFFFF', '25px')
        ).setOrigin(0.5).setLineSpacing(6);

        // 점수 감소 애니메이션
        const tick = this.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                if (current > 0) {
                    current -= 1;
                    scoreText.setText(`Score\n${current}`);
                } else {
                    tick.remove();
                }
            }
        });

        // 입력 → 메인 재시작
        this.input.keyboard.once('keydown', () => this.scene.start('MainScene'));
    }
}
