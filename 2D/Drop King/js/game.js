import PreloadScene from './scenes/PreloadScene.js';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js'

const config = { //config는 인스턴스 초기화 역할
    type: Phaser.AUTO, //랜더링 방식
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT, //가로세로 유지하면서 최대한 맞도록 확대 및 축소
        autoCenter: Phaser.Scale.CENTER_BOTH, //중앙 배치
    },  
    physics: { //물리엔진
        default: 'arcade', //아케이드 물리엔진, 2d의 적합
        arcade: {
            gravity: {y: 0}, //중력 설정
            debug: false //디버그 시각화 여부
        }
        
    },
    scene: [PreloadScene, MainScene, GameOverScene]
};

const game = new Phaser.Game(config);