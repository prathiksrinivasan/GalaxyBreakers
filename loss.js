var Loss = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "Loss" });
    },
    init: function(data) {
        this.score = data.score;
    },
    preload: function() {
        this.load.image('bg', 'Assets/Sprites/gameover.png');
        this.load.audio('bgm', 'Assets/Sound/BGM.wav')
    },
    create: function() {
        bgm = this.sound.add("bgm", {loop: true});
        bgm.play();
        this.add.image(400, 300, 'bg');

        this.input.on('pointerdown', function (pointer) {
            bgm.stop();
            this.scene.start("Title");
        }, this);

        
        scoreText = this.add.text(200, 300, 'FINAL SCORE: ' + String(score), {font: "35px Arial", fill: "#fff"});
    
    },
    update: function() {
    }
});