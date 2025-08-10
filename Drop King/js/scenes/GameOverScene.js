export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const centerX = this.cameras.main.width / 2;
    let current = Number(data?.score ?? 0);
    const image = String(data.image);
    const best = Number(localStorage.getItem('bestScore') || 0);

    // 캐릭터/이미지
    this.add.image(centerX + 10, 140, image)
      .setOrigin(0.5)
      .setScale(0.5);

    // 공통 텍스트 옵션 (잘림 방지 포함)
    const baseText = {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '25px',
      align: 'center',
      padding: { left: 10, right: 10, top: 10, bottom: 12 },
      resolution: 2,
      shadow: { offsetX: 0, offsetY: 1, blur: 4, color: '#00000066', fill: true }
    };

    // Best Score (노란색)
    const bestText = this.add.text(centerX, 260, `Best Score\n${best}`, {
      ...baseText,
      color: '#FFD700'
    }).setOrigin(0.5);
    bestText.setLineSpacing(6);

    // Score (흰색)
    const scoreText = this.add.text(centerX, 350, `Score\n${current}`, {
      ...baseText,
      color: '#FFFFFF'
    }).setOrigin(0.5);
    scoreText.setLineSpacing(6);

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
    this.input.once('pointerdown', () => this.scene.start('MainScene'));
  }
}
