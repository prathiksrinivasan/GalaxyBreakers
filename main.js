var Main = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this, { "key": "Main" });
    },
    preload: preload,
    create: create,
    update: update,
    extend: {
                    player: null,
                    healthpoints: null,
                    reticle: null,
                    moveKeys: null,
                    playerBullets: null,
                    enemyBullets: null,
                    time: 0,
                }
});


var EnemyBullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    { 
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        
        this.speed = 1;
        this.neg = false;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target, offset, speed)
    {
        radOffset = offset*Math.PI/180;
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y))+radOffset;
        
        if(target.y >= this.y)
        {
            this.xSpeed = speed*Math.sin(this.direction);
            this.ySpeed = speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -speed*Math.sin(this.direction);
            this.ySpeed = -speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation-radOffset; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
        this.speed = speed;
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.bulletKill();
        }
    },
    
    bulletKill: function(){
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }

});

//Regular Bullet
var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    { 
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bulletB');
        
        this.speed = 1;
        this.neg = false;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target, offset, speed)
    {
        radOffset = offset*Math.PI/180;
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y))+radOffset;
        
        if(target.y >= this.y)
        {
            this.xSpeed = speed*Math.sin(this.direction);
            this.ySpeed = speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -speed*Math.sin(this.direction);
            this.ySpeed = -speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation-radOffset; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
        this.speed = speed;
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.bulletKill();
        }
    },
    
    bulletKill: function(){
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }

});

//Spinning Bullet
var Bullet2 = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    { 
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bulletC');
        
        this.speed = 1;
        this.neg = false;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.swapDir = false;
        this.counter = 0;
        this.rotateCW = false;
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target, offset, speed)
    {
        radOffset = offset*Math.PI/180;
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y))+radOffset;
        if(target.y >= this.y)
        {
            //this.xSpeed = speed*Math.sin(this.direction);
            //this.ySpeed = speed*Math.cos(this.direction);
            this.swapDir = true;
            
        }
        else
        {
            //this.xSpeed = -speed*Math.sin(this.direction);
            //this.ySpeed = -speed*Math.cos(this.direction);
            this.swapDir = false;
        }

        this.rotation = shooter.rotation-radOffset; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
        this.speed = speed;
    },
    
    changeDir: function(){
        if(this.rotateCW){
            this.direction += .1
            this.rotation -=.1
        }else{
            this.rotation +=.1
            this.direction -=.1
        }
        if(this.swapDir == true)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        if(this.counter%30 == 0){
            //this.direction = this.direction % (2*Math.PI);
            this.changeDir();
            this.counter = 0;
        }
        this.born += delta;
        if (this.born > 1800)
        {
            this.bulletKill();
        }
    },
    
    bulletKill: function(){
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }

});

//Exploding Bullet
var Bullet3 = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    { 
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bulletD');
        
        this.speed = 1.25;
        this.neg = false;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.swapDir = false;
        this.counter = 0;
        this.exploded = false;
        this.explodeTime = 0;
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target, offset, explodeTime)
    {
        radOffset = offset*Math.PI/180;
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y))+radOffset;
        if(target.y >= this.y)
        {
            //this.xSpeed = speed*Math.sin(this.direction);
            //this.ySpeed = speed*Math.cos(this.direction);
            this.swapDir = true;
            
        }
        else
        {
            //this.xSpeed = -speed*Math.sin(this.direction);
            //this.ySpeed = -speed*Math.cos(this.direction);
            this.swapDir = false;
        }

        this.rotation = shooter.rotation-radOffset; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
        this.changeDir();
        //this.speed = speed;
        this.explodeTime = explodeTime;
    },
    
    changeDir: function(){
        if(this.swapDir == true)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        if(this.explodeTime-this.counter <= 0 && !this.exploded){
            this.exploded = true;
            this.counter = 0;
        }
        this.counter++;
        if(this.counter <=10 && this.exploded){
            this.scale = this.counter/2;
            this.born = 2400;
        }
        if(this.speed > 0){    
            this.speed -= .05*this.counter;
        }
        if(this.speed < 0){this.speed=0;}
        this.changeDir();
        this.born += delta;
        if (this.born > 2700)
        {
            this.bulletKill();
        }
    },
    
    bulletKill: function(){
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }

});

//Regular weapon
var Weapon = new Phaser.Class({
    initialize:
    function Weapon (scene, bulletsGroup){
        this.fireRate = 40;
        this.numBullets = 1;
        this.nextFire = 0;
        this.bulletSpeed = .75;
        this.bullets = bulletsGroup;
        this.maxBullets = 4;
    },
    
    fire: function (shooter, target){
        if(this.nextFire < this.fireRate) {
            this.nextFire++;
        }
        else{
            var startAngleOffset = 15*(this.numBullets-1)/2;
            for(var i = 0; i<this.numBullets; i++){
                var angle = 0 - startAngleOffset + (15*i);
                var bullet = playerBullets.get().setActive(true).setVisible(true);
                if(bullet){
                    bullet.fire(shooter, target , angle, this.bulletSpeed);
                }
            }
            this.nextFire = 0;
        }
    },
    
    increaseBullets: function(){
        this.numBullets += 1;
    },
    
    increaseRate: function(){
        this.fireRate -= 10;
    },
    
    increaseSpeed: function(){
        this.bulletSpeed += .25;
    },
    
    chooseUpgrade: function(UG){
        if(this.bullets < 2){
            this.increaseBullets();
        }else{
            switch(UG){
                case(0):
                    this.increaseBullets();
                case(1):
                    this.increaseRate();
                case(2):
                    this.increaseSpeed();
            }                
        }
    },
    
});

//Spinning weapon
var Weapon2 = new Phaser.Class({
    initialize:
    function Weapon (scene, bulletsGroup){
        this.fireRate = 60;
        this.numBullets = 0;
        this.nextFire = 0;
        this.bulletSpeed = .75;
        this.bullets = bulletsGroup;
        this.maxSpeed = 1.5;
        this.maxBullets = 4;
        this.minRate = 20;
    },
    
    fire: function (shooter, target){
        if(this.nextFire < this.fireRate) {
            this.nextFire++;
        }
        else{
            var startAngleOffset = -90;
            for(var i = 0; i<this.numBullets; i++){
                var angle = 0 - startAngleOffset + (90*(i));
                var bullet = this.bullets.get().setActive(true).setVisible(true);
                if(bullet){
                    bullet.fire(shooter, target , angle, this.bulletSpeed);
                }
            }
            this.nextFire = 0;
        }
    },
    
    increaseBullets: function(){
        this.numBullets += 1;
    },
    
    increaseRate: function(){
        this.fireRate -= 10;
    },
    
    increaseSpeed: function(){
        this.bulletSpeed += .25;
    },
    chooseUpgrade: function(UG){
        if(this.bullets < 2){
            this.increaseBullets();
        }else{
            switch(UG){
                case(0):
                    this.increaseBullets();
                case(1):
                    this.increaseRate();
                case(2):
                    this.increaseSpeed();
            }                
        }
    },
    
    
});

//Exploding weapon
var Weapon3 = new Phaser.Class({
    initialize:
    function Weapon (scene, bulletsGroup){
        this.fireRate = 90;
        this.numBullets = 0;
        this.nextFire = 0;
        this.bulletSpeed = 1;
        this.explodeTime = 100;
        this.bullets = bulletsGroup;
        this.minTime = 25;
        this.maxBullets = 4;
        this.minRate = 30;
    },
    
    fire: function (shooter, target){
        if(this.nextFire < this.fireRate) {
            this.nextFire++;
        }
        else{
            var startAngleOffset = 60*(this.numBullets-1)/2;
            for(var i = 0; i<this.numBullets; i++){
                var angle = 180 - startAngleOffset + (60*(i));
                var bullet = this.bullets.get().setActive(true).setVisible(true);
                if(bullet){
                    bullet.fire(shooter, target , angle, this.explodeTime);
                }
            }
            this.nextFire = 0;
        }
    },
    
    increaseBullets: function(){
        this.numBullets += 1;
    },
    
    increaseRate: function(){
        this.fireRate -= 20;
    },
    
    increaseSpeed: function(){
        this.explodeTime -= 25;
    },
    
    chooseUpgrade: function(UG){
        if(this.bullets < 2){
            this.increaseBullets();
        }else{
            switch(UG){
                case(0):
                    this.increaseBullets();
                case(1):
                    this.increaseRate();
                case(2):
                    this.increaseSpeed();
            }                
        }
    },
    
    
});

function preload ()
{
    // Load in images and sprites
    this.load.spritesheet('player_handgun', 'Assets/Sprites/ship.png',
        { frameWidth: 606, frameHeight: 535 }
    );
    this.load.spritesheet('turret', 'Assets/Sprites/gunner.png',
        { frameWidth: 606, frameHeight: 535 }
    );
    this.load.spritesheet('enemy', 'Assets/Sprites/Enemy1.png',
        { frameWidth: 606, frameHeight: 535 }
    );
    this.load.spritesheet('enemy2', 'Assets/Sprites/Enemy2.png',
        { frameWidth: 606, frameHeight: 535 }
    );
    this.load.spritesheet('enemy3', 'Assets/Sprites/Enemy3.png',
        { frameWidth: 606, frameHeight: 535 }
    );
    this.load.image('bullet', 'Assets/Sprites/bullet.png');
    this.load.image('bulletB', 'Assets/Sprites/bullet6.png');
    this.load.image('bulletC', 'Assets/Sprites/bulletC.png');
    this.load.image('bulletD', 'Assets/Sprites/bulletD.png');
    this.load.image('target', 'Assets/Sprites/reticle.png');
    this.load.image('background', 'Assets/Sprites/spaceBG.jpg');
    this.load.image('heart', 'Assets/Sprites/heart.png');
    this.load.image('loss', 'Assets/Sprites/loss.png');
    
    this.load.audio('playerShoot', 'Assets/Sound/playerShoot.wav')
    this.load.audio('enemyShoot', 'Assets/Sound/enemyShoot.wav')
    this.load.audio('hit', 'Assets/Sound/Hit.wav')
    this.load.audio('death', 'Assets/Sound/explosion.wav')
    this.load.audio('bgm', 'Assets/Sound/BGM.wav')
    
    this.load.image('tutorial', 'Assets/Sprites/tutorialBlock.png')
    
    this.load.image('particle1', 'Assets/Sprites/particle1.png')
    this.load.image('particle2', 'Assets/Sprites/particle2.png')
    this.load.image('particle3', 'Assets/Sprites/particle3.png')
    this.load.image('particle4', 'Assets/Sprites/particle4.png')
    
    this.load.image('wave', 'Assets/Sprites/wave.png')
}

function create ()
{ 
    var velocity = 0;
    enemies = [];
    start = false;
    isPaused = false;
    killCount;
    weapons = [];
    // Set world bounds
    this.physics.world.setBounds(0, 0, 3000, 2000);

    // Add 2 groups for Bullet objects
    playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, defaultKey: 'bullet' });
    playerBullets2 = this.physics.add.group({ classType: Bullet2, runChildUpdate: true, defaultKey: 'bullet2' });
    playerBullets3 = this.physics.add.group({ classType: Bullet3, runChildUpdate: true, defaultKey: 'bullet3' });
    enemyBullets = this.physics.add.group({ classType: EnemyBullet, runChildUpdate: true, defaultKey: 'bullet' });
    
    this.physics.add.overlap(playerBullets, enemyBullets, bulletCollideCallback);
    this.physics.add.overlap(playerBullets2, enemyBullets, bulletCollideCallback);
    this.physics.add.overlap(playerBullets3, enemyBullets, bulletCollideCallback);

    // Add background player, enemy, reticle, healthpoint sprites
    var background = this.add.image(1500, 1000, 'background');
    player = this.physics.add.sprite(1500, 1000, 'player_handgun');
    turret = this.add.sprite(1500, 1000, 'turret');
    reticle = this.physics.add.sprite(800, 700, 'target');
    hp1 = this.add.image(-350, -250, 'heart').setScrollFactor(0, 0);
    hp2 = this.add.image(-300, -250, 'heart').setScrollFactor(0, 0);
    hp3 = this.add.image(-250, -250, 'heart').setScrollFactor(0, 0);
    
    
    expBG = this.add.rectangle(450,800,400, 20, 0x000000).setStrokeStyle(4,0xffffff);
    exp = 1;
    maxExp = 100;
    playerlvl = 0;
    expBar = this.add.rectangle(450,800,400, 20, 0x00ffff);
    expBar.setScrollFactor(0,0);
    expBG.setScrollFactor(0,0);
    
    this.weapons = [];
    this.weapons.push(new Weapon(this.game, playerBullets));
    this.weapons.push(new Weapon2(this.game, playerBullets2));
    this.weapons.push(new Weapon3(this.game, playerBullets3));
    

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(6000, 4000);
    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
    turret.setOrigin(.3,.5).setDisplaySize(132,120);
    //var enemies = [];
    maxEnemies = 1;
    currentEnemies = 0;
    activeEnemies = 0;
    killCount = 0;
    score = 0;
    wave = 1;
    waveStart = false;
    //create list of a certain amount of enemies, assign health/position/etc values
    for(var i = 0; i<maxEnemies; i++){
        spawnPosX = Phaser.Math.Between(100, 2900);
        spawnPosY = Phaser.Math.Between(100, 2900);
        while(Math.abs(player.X - spawnPosX) < 1000){
              spawnPosX = Phaser.Math.Between(100, 2900);
        }
        while(Math.abs(player.Y - spawnPosY) < 1000){
              spawnPosY = Phaser.Math.Between(100, 1900);
        }
        newEnemy = this.physics.add.sprite(spawnPosX,spawnPosY,'enemy');
        newEnemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
        newEnemy.fireRate = 6000;
        newEnemy.lastFired = 0;
        newEnemy.health = 1;
        newEnemy.enemyCollider = this.physics.add.overlap(playerBullets, newEnemy, enemyHitCallback);
        newEnemy.enemyCollider = this.physics.add.overlap(playerBullets2, newEnemy, enemyHitCallback);
        newEnemy.enemyCollider = this.physics.add.overlap(playerBullets3, newEnemy, enemyHitCallback);
        enemies.push(newEnemy);
        currentEnemies++;
        activeEnemies++;
    }
    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
    
    hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

    // Set sprite variables
    player.health = 3;

    // Set camera properties
    this.cameras.main.zoom = 0.5;
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0,0,3000,2000);
    
    // Set SFX
    enemyShootSFX = this.sound.add("enemyShoot", {loop: false});
    hitSFX = this.sound.add("hit", {loop: false});
    deathSFX = this.sound.add("death", {loop: false});
    bgm = this.sound.add("bgm", {loop: true});
    //bgm.play();
    
    //NEW MOVEMENT -------------------------------------
    player.setFrictionX(100);
    player.setFrictionY(100);
    this.cursors = this.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.W,
         down:Phaser.Input.Keyboard.KeyCodes.S,
         left:Phaser.Input.Keyboard.KeyCodes.A,
         right:Phaser.Input.Keyboard.KeyCodes.D});

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);
    
    this.input.setPollAlways();
    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            reticle.x += pointer.movementX;
            reticle.y += pointer.movementY;
        }
    }, this);
    
     //pause functionality
    this.input.keyboard.on('keydown-P', function () {
        this.scene.pause();
        this.scene.launch('Pause');
    }, this)
    
    //game ui
    scorecounter = this.add.text(-100,-275, 'Score: '+score.toString(), {font: '32px Arial',fill: '#FFFFFF'}).setScrollFactor(0, 0);
    wavecounter = this.add.text(1000,-275, 'Wave: '+wave.toString(), {font: '32px Arial',fill: '#FFFFFF'}).setScrollFactor(0, 0);
    
    //EXPLOSION FUNCTIONALITY
    emitter0 = this.add.particles('particle1').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -500, max: 500 },
        angle: { min: 0, max: 360 },
        scale: { start: 10, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        //gravityY: 800
    });

    emitter1 = this.add.particles('particle2').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -500, max: 500 },
        angle: { min: 0, max: 360 },
        scale: { start: 10, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 300,
        //gravityY: 800
    });
    
    //UPGRADE VFX
    emitter2 = this.add.particles('particle3').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -500, max: 500 },
        angle: { min: 0, max: 360 },
        scale: { start: 5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        //gravityY: 800
    });
    
    emitter3 = this.add.particles('particle4').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -500, max: 500 },
        angle: { min: 0, max: 360 },
        scale: { start: 5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        //gravityY: 800
    });
    
    waveImage = this.add.image(400, 300, 'wave').setScrollFactor(0, 0);
    waveImage.visible = false;
    
}

function enemyHitCallback(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        enemyHit.health--;
        console.log("Enemy hp: ", enemyHit.health);
        hitSFX.play();

        // Kill enemy if health <= 0
        if (enemyHit.health <= 0)
        {
            if(enemyHit.texture.key == 'enemy'){
                score+= 300;
            }
            else if(enemyHit.texture.key == 'enemy2'){
                score+= 750;
            }
            else if(enemyHit.texture.key == 'enemy3'){
                score+= 1500;
            }
            deathSFX.play();
            killCount ++;
            currentEnemies--;
            activeEnemies--;
            enemies.splice(enemies.indexOf(enemyHit),1);

            //explode
            emitter0.setPosition(enemyHit.x, enemyHit.y);
            emitter1.setPosition(enemyHit.x, enemyHit.y);
            for(let i = 0; i < 20; i++){
                emitter0.explode();
                emitter1.explode(); 
            }
            
            enemyHit.setVisible(false);
            enemyHit.setActive(false); 
            enemyHit.enemyCollider.destroy();  
            enemyHit.destroy();
            exp+=50;
        }

        // Destroy bullet
        bulletHit.bulletKill();
    }
}

function playerHitCallback(playerHit, bulletHit)
{
    // Reduce health of player
    if (bulletHit.active === true && playerHit.active === true)
    {
        playerHit.health = playerHit.health - 1;
        console.log("Player hp: ", playerHit.health);
        hitSFX.play();

        // Kill hp sprites and kill player if health <= 0
        if (playerHit.health == 2)
        {
            hp3.destroy();
        }
        else if (playerHit.health == 1)
        {
            hp2.destroy();
        }
        else if (playerHit.health == 0)
        {
            hp1.destroy();
            // Game over state should execute here
        }

        // Destroy bullet
        bulletHit.bulletKill();
    }
}

function bulletCollideCallback(bullet1, bullet2){
    bullet1.bulletKill();
    bullet2.bulletKill();
}

function enemyFire(enemy, player, time, gameObject)
{
    if (enemy.active === false)
    {
        return;
    }
    
    if ((time - enemy.lastFired) > enemy.fireRate)
    {
        enemy.lastFired = time;

        // Get bullet from bullets group
        var bullet = enemyBullets.get().setActive(true).setVisible(true);

        if (bullet)
        {
            bullet.fire(enemy, player, 0, 1);
            // Add collider between bullet and player
            gameObject.physics.add.overlap(player, bullet, playerHitCallback);
            enemyShootSFX.play()
        }
    }
}

function enemyFollow(enemy, player, game){
    if (enemy.texture.key == 'enemy'){
        game.physics.moveToObject(enemy, player, 100);
    }
    else if (enemy.texture.key == 'enemy2'){
        game.physics.moveToObject(enemy, player, 300);
    }
    else if (enemy.texture.key == 'enemy3'){
        game.physics.moveToObject(enemy, player, 500);
    }
}

// Ensures sprite speed doesnt exceed maxVelocity while update is called
function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}

// Ensures reticle does not move offscreen
function constrainReticle(reticle)
{
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen (player follow)
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;
}

function midWaveAnnouncement(time, image, timeActivator){
    // pop up wave start screen
        waveImage.visible = true;
        if(setTime[timeActivator]){
            currentTime = time;
            setTime[timeActivator] = false;
        }
        if((time - currentTime) > 5000){
            waveImage.visible = false;
            waveStart = false;
        }
}

function update (time, delta)
{   
    
    // PROGRESSION SYSTEM-- MAKE VALUES LONGER FOR FINAL
    if(killCount == 5 && !waveStart){
        wave = 2;
        maxEnemies = 2;
        waveStart = true;
    }
    else if (killCount == 15 && !waveStart){
        wave = 3;
        maxEnemies = 3;
        waveStart = true;
    }
    else if (killCount == 35 && !waveStart){
        wave = 4;
        maxEnemies = 4;
        waveStart = true;
    }
    else if (killCount == 50 && !waveStart){
        wave = 5;
        maxEnemies = 5;
        waveStart = true;
    }
    
    if(waveStart){
        switch(wave){
            case 2:
                midWaveAnnouncement(time, waveImage, 0)
                break
            case 3:
                midWaveAnnouncement(time, waveImage, 1)
                break
            case 4:
                midWaveAnnouncement(time, waveImage, 2)
                break
            case 5:
                midWaveAnnouncement(time, waveImage, 3)
                break
        }
    }
    
    //spawns new enemies as enemies are killed
    if(activeEnemies < maxEnemies && !waveStart){
            //console.log(currentEnemies);
            spawnPosX = Phaser.Math.Between(100, 2900);
            spawnPosY = Phaser.Math.Between(100, 2900);
            if(Math.abs(player.x - spawnPosX) > 800 && Math.abs(player.y - spawnPosY) > 600){
                console.log("ENEMY GEN PASSED AT X: " + (player.x - spawnPosX) + " Y: " + (player.y - spawnPosY))
                //only then can we spawn the enemy
                newEnemy = this.physics.add.sprite(spawnPosX,spawnPosY,'enemy');
                newEnemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
                
                // enemy stats will be randomized based on how far into the game you are 
                switch(wave){
                    case 2:
                        enemyType = newEnemy.health = Math.floor(Math.random() * 2) + 1;
                        if(enemyType == 2){
                            newEnemy.fireRate = 2500;
                            newEnemy.lastFired = 0;
                            newEnemy.health = 10;
                            newEnemy.setTexture('enemy2')
                        }
                        else{
                            newEnemy.fireRate = 6000;
                            newEnemy.lastFired = 0;
                            newEnemy.health = 1;
                        }
                        break
                    case 3:
                        newEnemy.fireRate = 2500;
                        newEnemy.lastFired = 0;
                        newEnemy.health = 10; //all 20's
                        newEnemy.setTexture('enemy2')
                        break
                    case 4:
                        enemyType = newEnemy.health = Math.floor(Math.random() * 2) + 1;
                        if(enemyType == 2){
                            newEnemy.fireRate = 1000;
                            newEnemy.lastFired = 0;
                            newEnemy.health = 20;
                            newEnemy.setTexture('enemy3')
                        }
                        else{
                            newEnemy.fireRate = 2500;
                            newEnemy.lastFired = 0;
                            newEnemy.health = 10;
                            newEnemy.setTexture('enemy2')
                        }
                        break
                    case 5:
                        newEnemy.fireRate = 1000;
                        newEnemy.lastFired = 0;
                        newEnemy.health = 20; //all 50's
                        newEnemy.setTexture('enemy3')
                        break
                    default:
                        newEnemy.fireRate = 6000;
                        newEnemy.lastFired = 0;
                        newEnemy.health = 1;
                }

                newEnemy.enemyCollider = this.physics.add.overlap(playerBullets, newEnemy, enemyHitCallback);
                newEnemy.enemyCollider = this.physics.add.overlap(playerBullets2, newEnemy, enemyHitCallback);
                newEnemy.enemyCollider = this.physics.add.overlap(playerBullets3, newEnemy, enemyHitCallback);
                enemies.push(newEnemy);
                currentEnemies++;
                activeEnemies++;
            }
            
    }
    
    // Rotates enemy to face towards player
    for(var i = 0; i<enemies.length; i++){    
        //console.log(currentEnemies);
        //if(enemies[i].active == true){
            enemies[i].rotation = Phaser.Math.Angle.Between(enemies[i].x, enemies[i].y, player.x, player.y);
            enemyFire(enemies[i], player, time, this);
            enemyFollow(enemies[i], player, this);
        //}
    }
    
    expBar.width = (exp/maxExp) * 400;
    
    if(exp >= maxExp){
        exp = 1;
        playerlvl += 1;
        if(playerlvl <= 4){
            maxExp = 100;
        }else{    
            maxExp += 50;
        }
        rand = Phaser.Math.Between(0,2);
        randug = Phaser.Math.Between(0,2);
        this.weapons[rand].chooseUpgrade(randug);
        emitter2.setPosition(player.x, player.y);
        emitter3.setPosition(player.x, player.y);
        for(let i = 0; i < 20; i++){
                emitter2.explode();
                emitter3.explode(); 
            }
        /*
        if(rand == 0){
            this.weapons[0].increaseBullets(1);
        }
        if(rand == 1){
            this.weapons[0].increaseRate(2);
        }
        if(rand == 2){
            this.weapons[0].increaseSpeed(.5);
        }*/
    }
    
    //Make reticle move with player
    reticle.body.velocity.x = player.body.velocity.x;
    reticle.body.velocity.y = player.body.velocity.y;

    // Constrain velocity of player
    constrainVelocity(player, 500);

    // Constrain position of constrainReticle
    constrainReticle(reticle);
    
    //NEW MOVEMENT -------------------------------------
    if(this.cursors.up.isDown){
        player.setAccelerationY(-800)
    }
    if(this.cursors.down.isDown){
        player.setAccelerationY(800)
    }
    if(this.cursors.up.isUp && this.cursors.down.isUp){
        player.setAccelerationY(0)
    }
    if(this.cursors.left.isDown){
        player.setAccelerationX(-800)
    }
    if(this.cursors.right.isDown){
        player.setAccelerationX(800)
    }
    if(this.cursors.right.isUp && this.cursors.left.isUp){
        player.setAccelerationX(0)
    }
    
    for(var i = 0; i<this.weapons.length; i++){
        this.weapons[i].fire(turret, reticle);
    }
    
    if(player.health <= 0){
        //loss = this.add.image(400, 300, 'loss').setScrollFactor(0, 0);
        //game.scene.pause("default");
        bgm.stop();
        this.scene.start("Loss", {score: score});
    }
    scorecounter.text = 'Score: '+score.toString();
    wavecounter.text = 'Wave: '+wave.toString();
    
    // Rotates player and turret
    turret.rotation = Phaser.Math.Angle.Between(turret.x, turret.y, reticle.x, reticle.y);
    turret.setPosition(player.x+(-20*Math.cos(player.rotation)),player.y+(-20*Math.sin(player.rotation)));
    if(player.body.velocity.length() >= .02){
        player.rotation = Phaser.Math.Angle.Between(player.x, player.y, player.x+player.body.velocity.x,  player.y+player.body.velocity.y);
    } 
}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Score: ' + score, 700, 32);

}