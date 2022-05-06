var Credits = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "Credits" });
    },
    init: function(data) {
        this.score = data.score;
    },
    preload: function() {
        this.load.image('credits', 'Assets/Sprites/credits.png');
    },
    create: function() {
        this.add.image(400, 300, 'credits');
    },
    update: function() {
    }
});