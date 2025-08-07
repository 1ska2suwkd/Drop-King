import PreloadScene from './scenes/PreloadScene.js';
import StartScene from './scenes/StartScene.js';
import MainScene from './scenes/MainScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameOverScene from './scenes/GameOverScene.js'
import timeOverScene from './scenes/timeOverScene.js'

const config = { //config는 인스턴스 초기화 역할
    type: Phaser.AUTO, //랜더링 방식
    width: 666,
    height: 500,
    parent: 'game-container',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT, //가로세로 유지하면서 최대한 맞도록 확대 및 축소
        autoCenter: Phaser.Scale.CENTER_BOTH, //중앙 배치
    },  
    physics: { //물리엔진
        default: 'arcade', //아케이드 물리엔진, 2d의 적합
        arcade: {
            gravity: {y: 1000}, //중력 설정
            debug: true //디버그 시각화 여부
        }
        
    },
    scene: [PreloadScene, StartScene, IntroScene, GameOverScene, MainScene, timeOverScene]
};

const game = new Phaser.Game(config);