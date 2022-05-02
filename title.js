var Title = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "Title" });
    },
    init: function() {
    },
    preload: function() {
        this.load.image('title', 'Assets/Sprites/title.png');
        this.load.audio('bgm', 'Assets/Sound/BGM.wav')
    },
    create: function() {
        bgm = this.sound.add("bgm", {loop: true});
        bgm.play();
        this.add.image(400, 300, 'title');

        this.input.on('pointerdown', function (pointer) {
        bgm.stop();
        this.scene.start("Main");
    }, this);
    },
    update: function() {
    }
});