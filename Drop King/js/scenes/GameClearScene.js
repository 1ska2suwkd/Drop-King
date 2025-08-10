import { strokedTextStyle } from "../ui/TextStyles.js";

export default class GameClearScene extends Phaser.Scene {
    constructor() {
        super('GameClearScene');
    }

    create(data) {
        const centerX = this.cameras.main.width / 2;
        let score = Number(data?.score ?? 0);

        const prevBest = Number(localStorage.getItem('bestScore') || 0);
        const best = Math.max(prevBest, score);
        localStorage.setItem('bestScore', best);


        this.add.image(333, 250, 'gameClear')
            .setScale(0.75);

        this.add.text(centerX, 260, `Best Score\n${best}`, {
            ...strokedTextStyle('#FFD700', '30px')
        }).setOrigin(0.5).setLineSpacing(6);

        this.add.text(centerX, 370, `Score\n${score}`, {
            ...strokedTextStyle('#FFFFFF', '30px')
        }).setOrigin(0.5).setLineSpacing(6);



        // 아무 키/클릭 → 메인 재시작 (원하면 StartScene으로 변경)
        this.input.keyboard.once('keydown', () => this.scene.start('MainScene'));
        this.input.once('pointerdown', () => this.scene.start('MainScene'));
    }

}
