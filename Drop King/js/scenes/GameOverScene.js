export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        const centerX = this.cameras.main.width / 2;
        let current = Number(data?.score ?? 0);
        let image = String(data.image);

        const best = Number(localStorage.getItem('bestScore') || 0);

        this.add.image(centerX+10, 140, image)
        .setOrigin(0.5)
        .setScale(0.5);

        const style = { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#fff', align: 'center' };
        const scoreText = this.add.text(centerX, 300, `Score: ${current}`, style).setOrigin(0.5);
        this.add.text(centerX, 260, `Best:  ${best}`, style).setOrigin(0.5);

        const tick = this.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                if (current > 0) {
                    current -= 1;
                    scoreText.setText(`Score: ${current}`);
                } else {
                    tick.remove(); // ← 이 이벤트만 종료
                }
            }
        });

        // 아무 키/클릭 → 메인 재시작 (원하면 StartScene으로 변경)
        this.input.keyboard.once('keydown', () => this.scene.start('MainScene'));
        this.input.once('pointerdown', () => this.scene.start('MainScene'));
    }

}
