var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    scene: {
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
    }
};

var game = new Phaser.Game(config);

var Bullet = new Phaser.Class({

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

var Weapon = new Phaser.Class({
    initialize:
    function Weapon (scene, bulletsGroup){
        this.fireRate = 30;
        this.numBullets = 1;
        this.nextFire = 0;
        this.bulletSpeed = 1;
        this.bullets = bulletsGroup;
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
    
    increaseBullets: function(amount){
        this.numBullets += amount;
    },
    
    increaseRate: function(amount){
        this.fireRate /= amount;
    },
    
    increaseSpeed: function(amount){
        this.bulletSpeed += amount;
    },
    
    
});

function preload ()
{
    // Load in images and sprites
    this.load.spritesheet('player_handgun', 'Assets/Sprites/wipGunner.png',
        { frameWidth: 66, frameHeight: 60 }
    );
    this.load.spritesheet('enemy', 'Assets/Sprites/wipEnemy.png',
        { frameWidth: 66, frameHeight: 60 }
    );
    this.load.spritesheet('enemy2', 'Assets/Sprites/wipEnemy2.png',
        { frameWidth: 66, frameHeight: 60 }
    );
    this.load.spritesheet('enemy3', 'Assets/Sprites/wipEnemy3.png',
        { frameWidth: 66, frameHeight: 60 }
    );
    this.load.image('bullet', 'Assets/Sprites/bullet.png');
    this.load.image('target', 'Assets/Sprites/reticle.png');
    this.load.image('background', 'Assets/Sprites/spaceBG.jpg');
    this.load.image('heart', 'Assets/Sprites/heart.png');
    this.load.image('loss', 'Assets/Sprites/loss.png');
    
    this.load.audio('playerShoot', 'Assets/Sound/playerShoot.wav')
    this.load.audio('enemyShoot', 'Assets/Sound/enemyShoot.wav')
    this.load.audio('hit', 'Assets/Sound/Hit.wav')
    this.load.audio('death', 'Assets/Sound/explosion.wav')
    
    this.load.image('tutorial', 'Assets/Sprites/tutorialBlock.png')
    
    this.load.image('particle1', 'Assets/Sprites/particle1.png')
    this.load.image('particle2', 'Assets/Sprites/particle2.png')
    
    this.load.image('wave', 'Assets/Sprites/wave.png')
}

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


function create ()
{
    
    enemies = [];
    start = false;
    isPaused = false;
    killCount;
    weapons = [];
    // Set world bounds
    this.physics.world.setBounds(0, 0, 3000, 2000);

    // Add 2 groups for Bullet objects
    playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, defaultKey: 'bullet' });
    enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true, defaultKey: 'bullet' });
    
    this.physics.add.overlap(playerBullets, enemyBullets, bulletCollideCallback);

    // Add background player, enemy, reticle, healthpoint sprites
    var background = this.add.image(1500, 1000, 'background');
    player = this.physics.add.sprite(1500, 1000, 'player_handgun');
    reticle = this.physics.add.sprite(800, 700, 'target');
    hp1 = this.add.image(-350, -250, 'heart').setScrollFactor(0, 0);
    hp2 = this.add.image(-300, -250, 'heart').setScrollFactor(0, 0);
    hp3 = this.add.image(-250, -250, 'heart').setScrollFactor(0, 0);
    
    
    expBG = this.add.rectangle(300,-250,400, 20, 0x000000).setStrokeStyle(4,0xffffff);
    exp = 1;
    maxExp = 100;
    expBar = this.add.rectangle(300,-250,400, 20, 0x00ffff);
    expBar.setScrollFactor(0,0);
    expBG.setScrollFactor(0,0);
    
    this.weapons = [];
    this.weapons.push(new Weapon(this.game, playerBullets));
    

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(6000, 4000);
    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
    //var enemies = [];
    maxEnemies = 1;
    currentEnemies = 0;
    activeEnemies = 0;
    killCount = 0;
    score = 0;
    wave = 1;
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
    

    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            reticle.x += pointer.movementX;
            reticle.y += pointer.movementY;
        }
    }, this);
    
    //game ui
    scorecounter = this.add.text(-100,-275, 'Score: '+score.toString(), {font: '32px Arial',fill: '#FFFFFF'}).setScrollFactor(0, 0);
    wavecounter = this.add.text(1000,-275, 'Wave: '+wave.toString(), {font: '32px Arial',fill: '#FFFFFF'}).setScrollFactor(0, 0);
    
    //EXPLOSION FUNCTIONALITY
    var emitter0 = this.add.particles('particle1').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'SCREEN',
        active: false,
        lifespan: 600,
        gravityY: 800
    });

    var emitter1 = this.add.particles('particle2').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'SCREEN',
        active: false,
        lifespan: 300,
        gravityY: 800
    });
    
}

function enemyHitCallback(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true)
    {
        enemyHit.health = enemyHit.health - 1;
        console.log("Enemy hp: ", enemyHit.health);
        hitSFX.play();

        // Kill enemy if health <= 0
        if (enemyHit.health <= 0)
        {
            
            score+= 300; //right now, all enemies give 300 points, but ideally this would change depending on the type of enemy killed.
            console.log(activeEnemies);
            deathSFX.play();
            killCount ++;
            currentEnemies--;
            activeEnemies--;
            enemies.splice(enemies.indexOf(enemyHit),1);
            console.log(enemies.length);
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

function enemyFollow(enemy, player, speed, game){
    game.physics.moveToObject(enemy, player, speed);
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

function update (time, delta)
{
    
    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Rotates enemy to face towards player
    for(var i = 0; i<enemies.length; i++){    
        console.log(currentEnemies);
        //if(enemies[i].active == true){
            enemies[i].rotation = Phaser.Math.Angle.Between(enemies[i].x, enemies[i].y, player.x, player.y);
            enemyFire(enemies[i],player, time, this);
            enemyFollow(enemies[i], player, 100, this);
        //}
    }
    
    // PROGRESSION SYSTEM
    if(killCount == 3){
        //wave = this.add.image(400, 300, 'wave').setScrollFactor(0, 0);
        wave = 2;
        maxEnemies = 2;
    }
    else if (killCount == 10){
        wave = 3;
        maxEnemies = 3;
    }
    else if (killCount == 20){
        wave = 4;
        maxEnemies = 4;
    }
    else if (killCount == 35){
        wave = 5;
        maxEnemies = 5;
    }
    
    //spawns new enemies as enemies are killed
    if(activeEnemies < maxEnemies){
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
                        newEnemy.fireRate = Math.floor(Math.random() * 1500) + 6000; //gen between 6000-7500
                        newEnemy.lastFired = 0;
                        newEnemy.health = Math.floor(Math.random() * 2) + 1; //gen between 1-2
                        if(newEnemy.health == 2){
                            newEnemy.setTexture('enemy2')
                        }
                        break
                    case 3:
                        newEnemy.fireRate = 7500; //all 7500
                        newEnemy.lastFired = 0;
                        newEnemy.health = 2; //all 2's
                        newEnemy.setTexture('enemy2')
                        break
                    case 4:
                        newEnemy.fireRate = Math.floor(Math.random() * 1500) + 7500; //gen between 7500-9000
                        newEnemy.lastFired = 0;
                        newEnemy.health = Math.floor(Math.random() * 3) + 1; //gen between 2-3
                        if(newEnemy.health == 2){
                            newEnemy.setTexture('enemy2')
                        }
                        else{
                            newEnemy.setTexture('enemy3')
                        }
                        break
                    case 5:
                        newEnemy.fireRate = 9000; //all 9000
                        newEnemy.lastFired = 0;
                        newEnemy.health = 3; //all 3's
                        newEnemy.setTexture('enemy3')
                        break
                    default:
                        newEnemy.fireRate = 6000;
                        newEnemy.lastFired = 0;
                        newEnemy.health = 1;
                }
                newEnemy.fireRate = 6000;
                newEnemy.lastFired = 0;
                newEnemy.health = 1;

                newEnemy.enemyCollider = this.physics.add.overlap(playerBullets, newEnemy, enemyHitCallback);
                enemies.push(newEnemy);
                currentEnemies++;
                activeEnemies++;
            }
            
    }
    
    expBar.width = (exp/maxExp) * 400;
    
    if(exp >= maxExp){
        exp = 0;
        maxExp += 50;
        rand = Phaser.Math.Between(0,2);
        if(rand == 0){
            this.weapons[0].increaseBullets(1);
        }
        if(rand == 1){
            this.weapons[0].increaseRate(2);
        }
        if(rand == 2){
            this.weapons[0].increaseSpeed(.5);
        }
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
        this.weapons[i].fire(player, reticle);
    }
    
    if(player.health <= 0){
        //loss = this.add.image(400, 300, 'loss').setScrollFactor(0, 0);
        //game.scene.pause("default");
        this.scene.restart();
    }
    scorecounter.text = 'Score: '+score.toString();
    wavecounter.text = 'Wave: '+wave.toString();
}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Score: ' + score, 700, 32);

}