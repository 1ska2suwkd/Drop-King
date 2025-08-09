export default class GameClearScene extends Phaser.Scene {
    constructor() {
        super('GameClearScene');
    }

    create(data) {
        const centerX = this.cameras.main.width / 2;
        let score = Number(data?.score ?? 0);
        let image = String(data.image);

        const prevBest = Number(localStorage.getItem('bestScore') || 0);
        const best = Math.max(prevBest, score);
        localStorage.setItem('bestScore', best);


        this.add.image(333, 250, 'gameClear')
            .setScale(0.75);

        const style = {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            color: '#ffffffff',        // 검은 글씨
            backgroundColor: '#000000ff', // 흰 배경
            align: 'center'
        };
        const scoreText = this.add.text(centerX, 300, `Score: ${score}`, style).setOrigin(0.5);
        this.add.text(centerX, 260, `Best:  ${best}`, style).setOrigin(0.5);



        // 아무 키/클릭 → 메인 재시작 (원하면 StartScene으로 변경)
        this.input.keyboard.once('keydown', () => this.scene.start('MainScene'));
        this.input.once('pointerdown', () => this.scene.start('MainScene'));
    }

}
