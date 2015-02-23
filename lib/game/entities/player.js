ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
        EntityPlayer = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Hero.png', 32, 32),
            size: {x:16, y:32},
            offset: {x:8, y:0},
            flip: false,
            maxVel: {x:100, y:150},
            friction: {x:600, y:0},
            accelGround: 400,
            accelAir: 200,
            jump: 200,
            isBlocking: false,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            //startPosition: null,
            //invincible: true,
            //invincibleDelay: 2,
            //invincibleTimer: null,

            init: function(x, y, settings){
                //this.startPosition = {x:x, y:y};
                this.parent(x, y, settings);
                this.addAnim('idleLeft', 1, [16]);
                this.addAnim('idleRight', 1, [0]);
                this.addAnim('runRight', .07, [0,1,2,3]);
                this.addAnim('runLeft', .07, [16,17,18,19]);
                this.addAnim('jumpRight', 1, [9, 10]);
                this.addAnim('jumpLeft', 1, [28, 29]);
                this.addAnim('fallRight', 0.4, [10]);
                this.addAnim('fallLeft', 0.4, [29]);
                this.addAnim('swimRight', 0.07, [7, 8]);
                this.addAnim('swimLeft', 0.07, [23,24]);
                this.addAnim('swingRight', 0.07, [11, 12, 13]);
                this.addAnim('swingLeft', 0.07, [25, 26, 27]);
                this.addAnim('hitRight', 0.07, [4, 5]);
                this.addAnim('swordRight', 1, [5]);
                this.addAnim('hitLeft', 0.07, [20,21]);
                this.addAnim('swordLeft', 1, [21]);
                this.addAnim('blockRight', 1, [6]);
                this.addAnim('blockLeft', 1, [22]);
                this.addAnim('climbUp', 0.07, [32,33,34,35]);
                this.addAnim('climbDown', 0.07, [32,33,34,35]);
                this.addAnim('deathAnimationRight', 0.07, [14, 15]);
                this.addAnim('deathAnimationLeft', 0.07, [30, 31]);
                //this.invincibleTimer = new ig.Timer();
                //this.makeInvincible();

                //this.setupAnimation(this.weapon);
            },

            //kill: function(){
            //    this.parent();
            //    var x = this.startPosition.x;
            //    var y = this.startPosition.y;
            //    ig.game.spawnEntity(EntityPlayer, x, y);
            //},

            //makeInvincible: function(){
            //    this.invincible = true;
            //    this.invincibleTimer.reset();
            //},

            //receiveDamage: function(amount, from){
            //    if(this.invincible)
            //        return;
            //    this.parent(amount, from);
            //},

            draw: function(){
                //if(this.invincible)
                //    this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
                this.parent();
            },

            //setupAnimation: function(){
            //    this.addAnim('idleLeft', 1, [0]);
            //    this.addAnim('idleRight', 1, [16]);
            //    this.addAnim('runRight', .07, [0,1,2,3]);
            //    this.addAnim('runLeft', .07, [16,17,18,19]);
            //    this.addAnim('jumpRight', 1, [9, 10]);
            //    this.addAnim('jumpLeft', 1, [28, 29]);
            //    this.addAnim('fallRight', 0.4, [10]);
            //    this.addAnim('fallLeft', 0.4, [29]);
            //    this.addAnim('swimRight', 0.07, [7, 8]);
            //    this.addAnim('swimLeft', 0.07, [23,24]);
            //    this.addAnim('swingRight', 0.07, [11, 12, 13]);
            //    this.addAnim('swingLeft', 0.07, [25, 26, 27]);
            //    this.addAnim('hitRight', 1, [4, 5]);
            //    this.addAnim('hitLeft', 1, [20,21]);
            //    this.addAnim('blockRight', 1, [6]);
            //    this.addAnim('blockLeft', 1, [22]);
            //    this.addAnim('climbUp', 0.07, [32,33,34,35]);
            //    this.addAnim('climbDown', 0.07, [32,33,34,35]);
            //    this.addAnim('deathAnimationRight', 0.07, [14, 15]);
            //    this.addAnim('deathAnimationLeft', 0.07, [30, 31]);
            //},

            update: function() {
                //left or right
                var accel = this.standing ? this.accelGround : this.accelAir;
                if(ig.input.state('left')){
                    if(!ig.input.state('block')) {
                        this.accel.x = -accel;
                        this.flip = true;
                    }
                }
                else if(ig.input.state('right')){
                    if(!ig.input.state('block')) {
                        this.accel.x = accel;
                        this.flip = false;
                    }
                }
                else if(ig.input.pressed('jump')){
                    this.vel.y = -this.jump;
                }
                else{
                    this.accel.x = 0;
                }

                if(this.vel.y < 0) {
                    this.isBlocking = false;
                    if(this.flip === false)
                        this.currentAnim = this.anims.jumpRight;
                    else
                        this.currentAnim = this.anims.jumpLeft;
                }
                else if(this.vel.y > 0) {
                    this.isBlocking = false;
                    if(this.flip === false)
                        this.currentAnim = this.anims.fallRight;
                    else
                        this.currentAnim = this.anims.fallLeft;
                }
                else if(this.vel.x != 0) {
                    this.isBlocking = false;
                    if(ig.input.state('jump')){
                        this.vel.y = -this.jump;
                        if(this.flip === false)
                            this.currentAnim = this.anims.jumpRight;
                        else
                            this.currentAnim = this.anims.jumpLeft;
                    }else {
                        if (this.flip === false)
                            this.currentAnim = this.anims.runRight;
                        else
                            this.currentAnim = this.anims.runLeft;
                    }
                }
                else {
                    if(ig.input.state('hit')) {
                        if (!this.isBlocking) {
                            if (this.flip === false) {
                                this.currentAnim = this.anims.hitRight;
                                this.currentAnim = this.anims.swordRight;
                            }
                            else {
                                this.currentAnim = this.anims.hitLeft;
                                this.currentAnim = this.anims.swordLeft;
                            }
                            ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {flip: this.flip});
                        }
                    }
                    else if( ig.input.state('block') ) {
                        this.isBlocking = true;
                        if (this.flip == false)
                            this.currentAnim = this.anims.blockRight;
                        else
                            this.currentAnim = this.anims.blockLeft;
                    }
                    else{
                        //this.accel.x = 0;
                        this.isBlocking = false;
                        if (this.flip === false)
                            this.currentAnim = this.anims.idleRight;
                        else
                            this.currentAnim = this.anims.idleLeft;
                    }
                }
                //
                //if(this.invincibleTimer.delta() > this.invincibleDelay){
                //    this.invincible = false;
                //    this.currentAnim.alpha = 1;
                //}

                //this.currentAnim.flip.x = this.flip;
                this.parent();
            }
        });

        EntityBullet = ig.Entity.extend({
            size: {x:5, y:5},
            //animSheet: new ig.AnimationSheet('media/bullet.png', 5, 3),
            maxVel: {x:200, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x + (settings.flip ? -2 : 4), y + 4, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.swing = new ig.Timer(.1);
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    this.kill();
                }
                if(this.swing.delta() > 0){
                    this.kill();
                }
            },
            check: function(other) {
                other.receiveDamage(3, this);
                if(this.pos.x < other.pos.x){
                    other.vel.x = 50;
                }
                else
                    other.vel.x = - 50;

                this.kill();
            }
        });

    });