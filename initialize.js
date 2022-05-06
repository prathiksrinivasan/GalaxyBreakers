var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [Title, Main, Pause, Loss, Credits]
};

var maxEnemies;
var currentEnemies;
var activeEnemies;
var score;
var wave;
var enemies = [];
var start = false;
var isPaused = false;
var killCount;
var weapons = [];
var player;
var waveStart;
var setTime = [true, true, true, true];
var waveImage;
var initWave = true;
var emitter0;
var emitter1;

var game = new Phaser.Game(config);