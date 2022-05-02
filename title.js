var Title = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "Title" });
    },
    init: function() {
    },
    preload: function() {
        this.load.image('title', 'Assets/Sprites/title.png');
    },
    create: function() {
        this.add.image(400, 300, 'title');

        this.input.on('pointerdown', function (pointer) {

        this.scene.start("Main");

    }, this);
    },
    update: function() {
    }
});