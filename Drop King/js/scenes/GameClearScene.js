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
    // 공통 텍스트 옵션 (잘림 방지 포함)
    const baseText = {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '30px',
      align: 'center',
      padding: { left: 10, right: 10, top: 10, bottom: 12 },
      resolution: 2,
       stroke: '#000000',       // 외곽선 색상 (검정)
  strokeThickness: 5,
      shadow: { offsetX: 1, offsetY: 1, blur: 30, color: '#00000066', fill: true }
    };

    // Best Score (노란색)
    const bestText = this.add.text(centerX, 260, `Best Score\n${best}`, {
      ...baseText,
      color: '#FFD700'
    }).setOrigin(0.5);
    bestText.setLineSpacing(6);

    // Score (흰색)
    const scoreText = this.add.text(centerX, 370, `Score\n${score}`, {
      ...baseText,
      color: '#FFFFFF'
    }).setOrigin(0.5);
    scoreText.setLineSpacing(6);



        // 아무 키/클릭 → 메인 재시작 (원하면 StartScene으로 변경)
        this.input.keyboard.once('keydown', () => this.scene.start('MainScene'));
        this.input.once('pointerdown', () => this.scene.start('MainScene'));
    }

}
