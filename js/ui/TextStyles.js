// TextStyles.js
export function baseTextStyle(color = '#ffffff', size = '20px') {
    return {
        fontFamily: '"Orbitron", sans-serif',
        fontSize: size,
        fill: color,
        align: 'center',
        padding: { left: 10, right: 10, top: 10, bottom: 12 },
        resolution: 2,
        shadow: { offsetX: 0, offsetY: 1, blur: 4, color: '#00000066', fill: true }
    };
}

// 외곽선이 필요한 경우
export function strokedTextStyle(color = '#ffffff', size = '30px') {
    return {
        ...baseTextStyle(color, size),
        stroke: '#000000',
        strokeThickness: 5
    };
}

// 고정 위치 텍스트 생성 헬퍼
export function addFixedText(scene, x, y, text, style) {
    return scene.add.text(x, y, text, style).setScrollFactor(0).setDepth(5);
}
