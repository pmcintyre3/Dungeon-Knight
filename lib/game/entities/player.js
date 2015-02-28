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
            haveJumped: false,
            isBlocking: false,
            isAttacking: false,
            swimTick: 0,
            zIndex: 0,
            atkCount: 3,
            swinging: false,
            swimming: false,
            climbing: false,
            overLadder: false,
            ladder: null,

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            startPosition: null,
            invincible: true,
            invincibleDelay: 2,
            invincibleTimer: null,

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
                this.addAnim('swimRight', 0.01, [7, 8]);
                this.addAnim('swimLeft', 0.01, [23, 24]);
                this.addAnim('swingRight', 0.07, [11, 12, 13]);
                this.addAnim('swingLeft', 0.07, [25, 26, 27]);
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
                this.addAnim('deathAnimationRight', 0.07, [14, 15]);
                this.addAnim('deathAnimationLeft', 0.07, [30, 31]);
                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();

                ig.game.player = this;
                //this.setupAnimation(this.weapon);
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

                if(!this.swimming) {
                    var accel = this.standing ? this.accelGround : this.accelAir;
                    this.swimTick = 0;
                }
                else
                    var accel = this.accelAir * 0.8;

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
                    this.gravityFactor = 0;
                    this.climbing = false;
                    this.standing = false;
                }
                if(this.climbing){
                    this.friction.y = 400;
                    this.gravityFactor = 0;
                    this.swimming = false;
                    this.standing = false;
                }

                //-------------------------------------------------
                //--------------- when swimming -------------------
                //-------------------------------------------------

                if(this.swimming){
                    if(this.swimTick == 360){
                        this.swimTick = 0;
                    }
                    else{
                        this.swimTick++;
                    }
                    this.pos.y += (Math.sin(this.swimTick));

                    if(ig.input.state('right')){
                        this.accel.x = accel;
                    }
                    if(ig.input.state('left')){
                        this.accel.x = -accel;
                    }
                    if(ig.input.state('jump')){
                        this.accel.y += -this.jump;
                        this.swimming = false;
                        this.gravityFactor = 1;
                        this.friction.y = 0;
                        this.friction.x = 400;
                    }

                    if(this.flip == false)
                        this.currentAnim = this.anims.swimRight;
                    else
                        this.currentAnim = this.anims.swimLeft;
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
                            ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {flip: this.flip});
                            this.atkCount--;
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

                else if (!this.swimming && !this.climbing && this.vel.y > 0) {
                    if (this.flip == false)
                        this.currentAnim = this.anims.fallRight;
                    else
                        this.currentAnim = this.anims.fallLeft;
                }
                else if (!this.swimming && !this.climbing && this.vel.y < 0) {
                    if (this.flip == false)
                        this.currentAnim = this.anims.jumpRight;
                    else
                        this.currentAnim = this.anims.jumpLeft;
                }

                this.afterMoveAndCollide();

                this.input = null;

                //else{
                //    this.friction.x = 800;
                //    this.friction.y = 800;
                //    if(ig.input.state('right')){
                //        this.flip = false;
                //        this.accel.x = accel;
                //    }
                //    else if(ig.input.state('left')){
                //        this.flip = true;
                //        this.accel.x = -accel;
                //    }
                //    else if(ig.input.state('jump')){
                //        this.vel.y = -this.jump;
                //    }
                //    else{
                //        this.accel.x = 0;
                //    }
                //
                //    if(this.vel.y < 0){
                //        if(this.flip == false)
                //            this.currentAnim = this.anims.swimRight;
                //        else
                //            this.currentAnim = this.anims.swimLeft;
                //
                //        this.swimming = false;
                //    }
                //    else if (this.vel.y > 0){
                //        if(this.flip == false)
                //            this.currentAnim = this.anims.fallRight;
                //        else
                //            this.currentAnim = this.anims.fallLeft;
                //    }
                //    else {
                //        if (this.flip == false) {
                //            this.currentAnim = this.anims.swimRight;
                //        }
                //        else {
                //            this.currentAnim = this.anims.swimLeft;
                //        }
                //    }
                //}
                if (this.invincibleTimer.delta() > this.invincibleDelay) {
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }

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
                }

               //if (this.possibleLandOnEntity && this.standing && this.overLadder)
               //     this.pos.y = this.ladder.pos.y - this.size.y;
               //this.flagPossibleLandOnEntity();
            },
            checkForLadder: function () {
                //this.ladder = null;
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

            //flagPossibleLandOnEntity: function () {
            //    this.possibleLandOnEntity = !this.standing;
            //},

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
            maxVel: {x:200, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.ACTIVE,

            init: function(x, y, settings) {
                this.parent(x + (settings.flip ? -2 : 16), y + 4, settings);
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
                this.kill();
            }
            //collideWith: function(other, axis) {
            //    if (other instanceof EntitySkeleton) {
            //        if (axis == 'y') {
            //            this.kill();
            //        }
            //        else {
            //            if (this.pos.x > other.pos.x) {
            //                other.vel.x = -other.maxVel.x / 2;
            //                other.vel.y = -other.maxVel.y / 3;
            //            }
            //            else {
            //                other.vel.x = other.maxVel.x / 2;
            //                other.vel.y = -other.maxVel.y / 3;
            //            }
            //        }
            //    }
            //    else
            //        this.parent(other,axis);
            //}
        });

    });