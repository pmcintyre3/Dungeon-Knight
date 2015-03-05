ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
        EntityPlayer = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Hero.png', 32, 32),
            size: {x: 16, y: 32},
            offset: {x: 8, y: 0},
            flip: false,
            vel: {x: 0, y: 0},
            maxVel: {x: 100, y: 150},
            friction: {x: 600, y: 0},
            accelGround: 400,
            accelAir: 200,
            jump: 200,
            maxHealth: 20,
            health: 20,
            weapon: 0,
            totalWeapons: 3,
            isBlocking: false,
            isAttacking: false,
            isHurt: false,
            swimTick: 0,
            zIndex: 0,
            atkCount: 3,
            swinging: false,
            swimming: false,
            climbing: false,
            overLadder: false,
            ladder: null,
            onRope: false,
            ropeHeight: 0,
            ropeWidth: 0,
            baseX: 0,
            baseY: 0,
            theta: 0,
            minTheta: 0,
            maxTheta: 0,

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            startPosition: null,
            invincible: true,
            invincibleDelay: 2,
            invincibleTimer: null,
            //hurtTimer: null,
            //hurtDelay: 1,

            init: function (x, y, settings) {
                this.startPosition = {x: x, y: y};
                this.parent(x, y, settings);

                //animations
                this.addAnim('idleLeft', 1, [16]);
                this.addAnim('idleRight', 1, [0]);
                this.addAnim('runRight', .07, [0, 1, 2, 3]);
                this.addAnim('runLeft', .07, [16, 17, 18, 19]);
                this.addAnim('jumpRight', 1, [9]);
                this.addAnim('jumpLeft', 1, [28]);
                this.addAnim('fallRight', 0.4, [10]);
                this.addAnim('fallLeft', 0.4, [29]);
                this.addAnim('swimRight', 0.6, [7, 8]);
                this.addAnim('swimLeft', 0.6, [23, 24]);
                this.addAnim('swingRight', 1, [11, 12, 13]);
                this.addAnim('swingLeft', 1, [25, 26, 27]);
                this.addAnim('hitRight', 0.07, [4, 5]);
                this.addAnim('swordRight', 1, [5]);
                this.addAnim('hitLeft', 0.07, [20, 21]);
                this.addAnim('swordLeft', 1, [21]);
                this.addAnim('blockRight', 1, [6]);
                this.addAnim('blockLeft', 1, [22]);
                this.addAnim('climb', 0.07, [32, 33, 34, 35]);
                this.addAnim('climbIdle', 1, [32]);
                //this.addAnim('climbUp', 0.07, [32,33,34,35]);
                //this.addAnim('climbDown', 0.07, [32,33,34,35]);
                this.addAnim('hurtRight', 1, [14]);
                this.addAnim('hurtLeft', 1, [30]);
                this.addAnim('deathAnimationRight', 0.07, [14, 15]);
                this.addAnim('deathAnimationLeft', 0.07, [30, 31]);

                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();

                ig.game.player = this;
            },

            kill: function () {
                this.parent();
                var x = this.startPosition.x;
                var y = this.startPosition.y;
                ig.game.spawnEntity(EntityPlayer, x, y);
            },

            makeInvincible: function () {
                this.invincible = true;
                this.invincibleTimer.reset();
            },

            receiveDamage: function (amount, from) {
                if (this.invincible)
                    return;
                this.parent(amount, from);
            },

            draw: function () {
                if (this.invincible)
                    this.currentAnim.alpha = this.invincibleTimer.delta() / this.invincibleDelay * 1;

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

            update: function () {
                var accel = this.standing ? this.accelGround : this.accelAir;

                //State changes
                if (!ig.input.state('hit')) {
                        this.atkCount = 3;
                        this.isAttacking = false;
                }
                if (!ig.input.state('block')) {
                    this.isBlocking = false;
                }
                if (this.standing) {
                    this.friction.y = 0;
                    this.friction.x = 400;
                    this.gravityFactor = 1;
                    this.climbing = false;
                    this.swimming = false;
                }
                if (this.swimming) {
                    this.friction.y = 150;
                    this.friction.x = 150;
                    this.gravityFactor = 0.3;
                    this.climbing = false;
                    this.standing = false;
                }
                if (this.climbing) {
                    this.friction.y = 400;
                    this.gravityFactor = 0;
                    this.swimming = false;
                    this.standing = false;
                }
                if (!this.standing && !this.swimming && !this.climbing) {
                    this.friction.y = 0;
                    this.friction.x = 400;
                    this.gravityFactor = 1;
                }
                if(!this.swinging) {
                    this.theta = 0;

                    if(ig.input.pressed('swap')){
                        this.weapon = (this.weapon + 1) % this.totalWeapons;
                    }
                    //-------------------------------------------------
                    //--------------- when swimming -------------------
                    //-------------------------------------------------

                    if (this.swimming) {
                        this.gravityFactor = 0.25;
                        this.friction = {x: 100, y: 100};
                        this.vel.y -= 2.5;

                        if (this.flip == false)
                            this.currentAnim = this.anims.swimRight;
                        else
                            this.currentAnim = this.anims.swimLeft;

                        if (ig.input.state('right')) {
                            this.flip = false;
                            this.accel.x = accel;
                        }
                        else if (ig.input.state('left')) {
                            this.flip = true;
                            this.accel.x = -accel;
                        }
                        else
                            this.accel.x = 0;

                        if (ig.input.state('jump')) {
                            this.vel.y = -this.jump / 2;
                        }
                    }

                    //-------------------------------------------------
                    //--------------- when climbing -------------------
                    //-------------------------------------------------

                    //when climbing
                    if (!this.swimming && this.climbing && (!ig.input.state('up') && !ig.input.state('down'))) {
                        this.vel.y = 0;
                        this.vel.x = 0;
                    }
                    if (!this.swimming && this.climbing && (ig.input.state('up') || ig.input.state('down'))) {
                        if (ig.input.state('up')) {
                            this.friction.y = 600;
                            this.gravityFactor = 0;
                            this.vel.y = -50;
                            this.accel.y = -accel;
                        }
                        else {
                            this.vel.y = 50;
                            this.accel.y = accel;
                            this.friction.y = 600;
                            this.gravityFactor = 0;
                        }
                    }
                    if (!this.swimming && this.climbing && this.vel.y < 0 && this.atTopOfLadder()) {
                        this.climbing = false;
                        this.standing = true;
                        this.gravityFactor = 1;
                        this.friction.y = 0;
                        this.accel.y = 0;
                    }
                    if (!this.swimming && this.climbing && this.vel.y > 0 && this.atBottomOfLadder()) {
                        this.standing = true;
                        this.climbing = false;
                        this.gravityFactor = 1;
                        this.friction.y = 0;
                        this.accel.y = 0;
                    }
                    if (!this.swimming && this.climbing && this.vel.y == 0) {
                        this.stop();
                    }

                    if (!this.swimming && this.climbing && ig.input.pressed('jump')) {
                        if (!ig.input.state('up') && !ig.input.state('down')) {
                            if (!this.atTopOfLadder() || !this.atBottomOfLadder()) {
                                this.jumpOffLadder('right');
                                this.climbing = false;
                                this.gravityFactor = 1;
                                this.friction.y = 0;
                                this.vel.y = -this.jump;
                            }
                        }
                    }

                    if (!this.swimming && this.climbing && ig.input.pressed('right')) {
                        this.jumpOffLadder('right');
                        this.climbing = false;
                        this.gravityFactor = 1;
                        this.friction.y = 0;
                    }

                    if (!this.swimming && this.climbing && ig.input.pressed('left')) {
                        this.jumpOffLadder('left');
                        this.climbing = false;
                        this.gravityFactor = 1;
                        this.friction.y = 0;
                    }

                    if (!this.swimming && this.climbing && this.vel.y != 0) {
                        this.currentAnim = this.anims.climb;
                    }
                    else {
                        if (!this.swimming && this.climbing) {
                            this.currentAnim = this.anims.climbIdle;
                        }
                    }

                    //-------------------------------------------------
                    //--------------- when not climbing ---------------
                    //-------------------------------------------------

                    if (!this.swimming && !this.climbing && this.standing && this.overLadder) {
                        if (ig.input.pressed('up') || ig.input.pressed('down')) {
                            this.getOnLadder()
                        }
                        else {
                            this.gravityFactor = 1;
                            this.friction.y = 0;
                        }
                    }

                    if (!this.swimming && !this.climbing && ig.input.state('hit')) {
                        if (!ig.input.state('block')) {
                            this.vel.x = 0;
                            this.accel.x = 0;
                            if(this.vel.y == 0 && this.vel.x == 0) {
                                if (this.flip == false) {
                                    this.currentAnim = this.anims.hitRight;
                                    this.currentAnim = this.anims.swordRight;
                                }
                                else {
                                    this.currentAnim = this.anims.hitLeft;
                                    this.currentAnim = this.anims.swordLeft;
                                }
                                while (this.atkCount) {
                                    this.isAttacking = true;
                                    switch (this.weapon) {
                                        case 0: //sword and shield
                                            ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {flip: this.flip});
                                            break;
                                        case 1: //fireball
                                            ig.game.spawnEntity(EntityFireBall, this.pos.x, this.pos.y, {flip: this.flip});
                                            break;
                                        case 2: //lightning
                                            ig.game.spawnEntity(EntityLightning, this.pos.x - 32, this.pos.y + 8, {flip: true});
                                            ig.game.spawnEntity(EntityLightning, this.pos.x, this.pos.y + 8, {flip: false});
                                            break;
                                    }
                                    this.atkCount--;
                                }
                            }
                        }
                    }
                    else if (!this.swimming && !this.climbing && ig.input.state('block')) {
                        if (!ig.input.state('hit')) {
                            this.vel.x = 0;
                            this.accel.x = 0;
                            if (this.flip == false)
                                this.currentAnim = this.anims.blockRight;
                            else
                                this.currentAnim = this.anims.blockLeft;

                            this.isBlocking = true;
                        }
                    }
                    else if (!this.swimming && !this.climbing && ig.input.state('left')) {
                        if (!ig.input.state('block') || !ig.input.state('hit')) {
                            this.flip = true;
                            this.accel.x = -accel;
                        }
                    }
                    else if (!this.swimming && !this.climbing && ig.input.state('right')) {
                        if (!ig.input.state('block') || !ig.input.state('hit')) {
                            this.accel.x = accel;
                            this.flip = false;
                        }
                    }
                    else {
                        if (!this.swimming && !this.climbing && (!ig.input.state('block') || !ig.input.state('hit'))) {
                            this.accel.x = 0;
                            if (this.flip == false)
                                this.currentAnim = this.anims.idleRight;
                            else
                                this.currentAnim = this.anims.idleLeft;
                        }
                        if (!this.swimming)
                            this.accel.x = 0;
                    }

                    if (!this.swimming && !this.climbing && (this.standing && ig.input.state('jump'))) {
                        if (!ig.input.state('block') || !ig.input.state('hit'))
                            this.vel.y = -this.jump;
                    }

                    if (!this.swimming && !this.climbing && this.vel.y > 0) {
                        if (this.flip == false)
                            this.currentAnim = this.anims.fallRight;
                        else
                            this.currentAnim = this.anims.fallLeft;
                    }

                    if (!this.swimming && !this.climbing && this.vel.x != 0) {

                        if (this.vel.y > 0) {
                            if (this.flip == false)
                                this.currentAnim = this.anims.fallRight;
                            else
                                this.currentAnim = this.anims.fallLeft;
                        }
                        else if (this.vel.y < 0) {
                            if (this.flip == false)
                                this.currentAnim = this.anims.jumpRight;
                            else
                                this.currentAnim = this.anims.jumpLeft;
                        }
                        else {
                            if (this.flip == false)
                                this.currentAnim = this.anims.runRight;
                            else
                                this.currentAnim = this.anims.runLeft;
                        }
                    }

                    else if (!this.swimming && !this.climbing && this.vel.y < 0) {
                        if (this.flip == false)
                            this.currentAnim = this.anims.jumpRight;
                        else
                            this.currentAnim = this.anims.jumpLeft;

                    }
                }
                else { //swinging
                    if (this.flip == false) {
                        this.currentAnim = this.anims.swingRight;
                        this.vel.x = this.baseX + this.ropeHeight * Math.cos(this.theta * (Math.PI / 180));
                        this.vel.y = -this.baseY * Math.sin(this.theta * (Math.PI / 180));
                        this.theta += 1.5;
                    }
                    else {
                        this.currentAnim = this.anims.swingLeft;
                        this.vel.x = -(this.baseX + this.ropeHeight * Math.cos(this.theta * (Math.PI / 180)));
                        this.vel.y = -this.baseY * Math.sin(this.theta * (Math.PI / 180));
                        this.theta += 1.5;
                    }
                }

                this.afterMoveAndCollide();

                this.input = null;

                if (this.invincibleTimer.delta() > this.invincibleDelay) {
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }

                this.swimming = false;
                this.swinging = false;
                this.parent();
            }, //update

            stop: function(){
                this.climbing = true;
                this.vel.x = 0;
                this.vel.y = 0;
                this.accel.x = 0;
                this.accel.y = 0;
            },

            handleMovementTrace: function (res) {
                if (this.overLadder)
                    this.standing = true;

                if(this.swimming){
                    if(res.collision.y){
                        if(this.flip)
                            this.currentAnim = this.anims.swimRight;
                        else
                            this.currentAnim = this.anims.swimLeft;
                    }
                }


                this.parent(res);
            },
            afterMoveAndCollide: function () {
                if (this.climbing && ig.input.state('down') && this.atBottomOfLadder()) {
                    this.climbing = false;
                }
                else if (this.climbing && ig.input.state('up') && this.atTopOfLadder()) {
                    this.pos.y = this.ladder.pos.y - this.size.y;
                    this.vel.y = 0;
                    this.climbing = false;
                }

                if (this.last.x != this.pos.x || this.last.y != this.pos.y) {
                    this.checkForLadder();
                    //this.checkForRope();
                }
            },
            checkForLadder: function () {
                this.overLadder = false;
                this.size.y += 1;
                var ladders = ig.game.getEntitiesByType(EntityLadder);
                for (var i = 0; i < ladders.length; i++) {
                    if (this.touches(ladders[i])) {
                        this.ladder = ladders[i];
                        this.overLadder = true;
                        break;
                    }
                }
                this.size.y -= 1;
            },

            atTopOfLadder: function () {
                return this.pos.y + this.size.y - 2 <= this.ladder.pos.y;
            },
            atBottomOfLadder: function () {
                var velocity = {x: 0, y: 1};
                var result = ig.game.collisionMap.trace(this.pos.x, this.pos.y, velocity.x, velocity.y, this.size.x, this.size.y);
                var stoppedByFloor = result.collision.y;
                var offLadder = this.pos.y >= this.ladder.pos.y + this.ladder.size.y;
                return stoppedByFloor || offLadder;
            },
            getOnLadder: function () {
                this.pos.x = this.ladder.pos.x + this.ladder.size.x / 2 - this.size.x / 2;
                this.friction.y = 600;
                this.gravityFactor = 0;
                this.accel.x = 0;
                this.vel.x = 0;
                this.climbing = true;
            },
            jumpOffLadder: function (dir) {
                this.vel.y = 0;
                this.vel.x = 0;
                if (!this.canMoveInDir(dir))
                    return;
                this.pos.x += ig.game.collisionMap.tilesize * (dir == 'left' ? -1 : 1);
                this.pos.y = this.last.y;
                this.climbing = false;
                this.accel.x = this.accel * (dir == 'left' ? -1 : 1);
                this.gravityFactor = 1;
                this.friction.y = 0;
                this.checkForLadder();
            },

            canMoveInDir: function (dir) {
                var velocity = {x: 0, y: 0};

                if (dir == 'left')
                    velocity.x = -1 * (this.offset.x + 1);
                else if (dir == 'right')
                    velocity.x = 1 * (this.offset.x + 1);
                else if (dir == 'up')
                    velocity.y = -1;
                else if (dir == 'down')
                    velocity.y = 1;

                var result = ig.game.collisionMap.trace(this.pos.x, this.pos.y, velocity.x, velocity.y, this.size.x, this.size.y);
                if (dir == 'left' || dir == 'right')
                    return !result.collision.x;
                else
                    return !result.collision.y;

            }

        });

        EntityBullet = ig.Entity.extend({
            size: {x:3, y:20},
            //animSheet: new ig.AnimationSheet('media/bullet.png', 5, 3),
            maxVel: {x:180, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x + (settings.flip ? -2 : 16), y + 4, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.swing = new ig.Timer(.04);
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
                other.receiveDamage(8, this);
                this.kill();
            }
        });
        EntityFireBall = ig.Entity.extend({
            size: {x:3, y:20},
            animSheet: new ig.AnimationSheet('media/Fireball.png', 32, 32),
            maxVel: {x:120, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.ACTIVE,

            init: function(x, y, settings) {
                this.parent(x + (settings.flip ? -8 : 36), y + 4, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim('shoot', 0.3, [0, 1]);
                this.burn = new ig.Timer(0.8);

                this.currentAnim.flip.x = settings.flip;
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    this.kill();
                }
                if(this.burn.delta() > 0){
                    this.kill();
                }
            },
            check: function(other) {
                other.receiveDamage(3, this);
                this.kill();
            }
        });
        EntityLightning = ig.Entity.extend({
            size: {x:3, y:20},
            animSheet: new ig.AnimationSheet('media/ShootLightning.png', 16, 16),
            maxVel: {x:180, y: 180},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            gravityFactor: 0,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x + (this.flip ? -2 : 16), y + 4, settings);
                this.vel.x = (this.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -this.maxVel.y;

                this.addAnim('shoot', 0.1, [0, 1]);
                this.currentAnim.angle = (this.flip ? this.currentAnim.angle+= Math.PI/4 : this.currentAnim.angle -= Math.PI/4);
                this.zap = new ig.Timer(1);

                this.currentAnim.flip.x = this.flip;
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    this.kill();
                }
                if(this.zap.delta() > 0){
                    this.kill();
                }
            },
            check: function(other) {
                other.receiveDamage(10, this);
                this.kill();
            }
        });

    });