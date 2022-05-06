var Pause = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "Pause" });
    },
    init: function(data) {
        this.score = data.score;
    },
    preload: function() {
        this.load.image('panel', 'Assets/Sprites/pausepopup.png');
    },
    create: function() {
        this.add.image(400, 300, 'panel');

        this.input.on('pointerdown', function (pointer) {
            this.scene.resume("Main");
            this.scene.stop('Pause');
            this.scene.stop('Credits')
        }, this);
        
        //credits... because he told us to put them on the pause menu
        this.input.keyboard.on('keydown-C', function () {
            this.scene.launch('Credits');
        }, this)
        
        scoreText = this.add.text(200, 300, 'CURRENT SCORE: ' + String(score), {font: "35px Arial", fill: "#fff"});
    
    },
    update: function() {
    }
});