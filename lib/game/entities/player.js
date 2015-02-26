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
            zIndex: 0,
            atkCount: 3,
            //canClimb: false,
            //isClimbing: false,
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
                this.addAnim('jumpRight', 1, [9, 10]);
                this.addAnim('jumpLeft', 1, [28, 29]);
                this.addAnim('fallRight', 0.4, [10]);
                this.addAnim('fallLeft', 0.4, [29]);
                this.addAnim('swimRight', 0.07, [7, 8]);
                this.addAnim('swimLeft', 0.07, [23, 24]);
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
                if (!ig.input.state('hit')) {
                    this.atkCount = 3;
                    this.isAttacking = false;
                }
                if(!ig.input.state('block')){
                    this.isBlocking = false;
                }
                if(this.standing){
                    this.climbing = false;
                }
                if(!this.climbing){
                    this.friction.y = 0;
                    this.gravityFactor = 1;
                }
                else{
                    this.friction.y = 400;
                    this.gravityFactor = 0;
                }
                var accel = this.standing ? this.accelGround : this.accelAir;


                //Ladder stuff

                //when climbing
                if (this.climbing && (!ig.input.state('up') && !ig.input.state('down'))) {
                    this.vel.y = 0;
                    this.vel.x = 0;
                    //this.accel.x = 0;
                    //this.accel.y = 0;
                }
                if (this.climbing && (ig.input.state('up') || ig.input.state('down'))) {
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
                    //this.currentAnim = this.anims.climb;
                    //this.currentAnim.timer.unpause();
                }
                if (this.climbing && this.vel.y < 0 && this.atTopOfLadder()) {
                    this.jumpOffLadder('right');
                    this.gravityFactor = 1;
                    this.friction.y = 0;
                }
                if (this.climbing && this.vel.y > 0 && this.atBottomOfLadder()) {
                    this.standing = true;
                    this.climbing = false;
                    this.gravityFactor = 1;
                    this.friction.y = 0;
                    console.log('bottom of ladder');
                }
                if(this.climbing && this.vel.y == 0){
                    this.stop();
                }

                if(this.climbing && ig.input.pressed('jump')){
                    if(!ig.input.state('up') && !ig.input.state('down')) {
                        this.jumpOffLadder('right');
                        this.climbing = false;
                        this.gravityFactor = 1;
                        this.friction.y = 0;
                        this.vel.y = -this.jump;
                        console.log('jump button');
                    }
                }

                if(this.climbing && ig.input.pressed('right')){
                    this.jumpOffLadder('right');
                    this.climbing = false;
                    this.gravityFactor = 1;
                    this.friction.y = 0;
                    console.log('right button');
                }

                if(this.climbing && ig.input.pressed('left')){
                    this.jumpOffLadder('left');
                    this.climbing = false;
                    this.gravityFactor = 1;
                    this.friction.y = 0;
                    console.log('left button');
                }

                if(this.climbing && this.vel.y  != 0){
                    this.currentAnim = this.anims.climb;
                }
                else{
                    if(this.climbing){
                        this.currentAnim = this.anims.climbIdle;
                    }
                }

                //this.afterMoveAndCollide();
                //
                //this.input = null;

                //-------------------------------------------------
                //when not climbing -------------------------------
                //-------------------------------------------------

                if(!this.climbing && this.standing && this.overLadder){
                    if(ig.input.pressed('up') || ig.input.pressed('down')){
                        this.getOnLadder()
                        //this.climbing = true;
                        //this.friction.y = 400;
                        //this.gravityFactor = 0;
                        //this.currentAnim = this.anims.climb;
                    }
                }

                //this.afterMoveAndCollide();
                //
                //this.input = null;

                if(!this.climbing && ig.input.state('hit')) {
                    if(!ig.input.state('block')) {
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
                else if(!this.climbing && ig.input.state('block')) {
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
                else if(!this.climbing && ig.input.state('left')){
                    if(!ig.input.state('block') || !ig.input.state('hit')){
                        this.flip = true;
                        this.accel.x = -accel;
                    }
                }
                else if(!this.climbing && ig.input.state('right')){
                    if(!ig.input.state('block') || !ig.input.state('hit')){
                        this.accel.x = accel;
                        this.flip = false;
                    }
                }
                else {
                    if(!this.climbing && (!ig.input.state('block') || !ig.input.state('hit'))){
                        this.accel.x = 0;
                        if (this.flip == false)
                            this.currentAnim = this.anims.idleRight;
                        else
                            this.currentAnim = this.anims.idleLeft;
                    }
                    this.accel.x = 0;
                }

                if(!this.climbing && (this.standing && ig.input.state('jump'))){
                    if(!ig.input.state('block') || !ig.input.state('hit'))
                        this.vel.y = -this.jump;
                }

                if(!this.climbing && this.vel.y > 0){
                    if(this.flip == false)
                        this.currentAnim = this.anims.fallRight;
                    else
                        this.currentAnim = this.anims.fallLeft;
                }

                if(!this.climbing && this.vel.x != 0) {
                    if(this.vel.y > 0){
                        if (this.flip == false)
                            this.currentAnim = this.anims.fallRight;
                        else
                            this.currentAnim = this.anims.fallLeft;
                    }
                    else if(this.vel.y < 0){
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

                else if(!this.climbing && this.vel.y > 0){
                    if(this.flip == false)
                        this.currentAnim = this.anims.fallRight;
                    else
                        this.currentAnim = this.anims.fallLeft;
                }
                else if(!this.climbing && this.vel.y < 0){
                    if(this.flip == false)
                        this.currentAnim = this.anims.jumpRight;
                    else
                        this.currentAnim = this.anims.jumpLeft;
                }
                //else {
                //    if (!this.isAttacking || !this.isBlocking) {
                //        console.log("idle2");
                //        if (this.flip == false)
                //            this.currentAnim = this.anims.idleRight;
                //        else
                //            this.currentAnim = this.anims.idleLeft;
                //    }
                //}

                this.afterMoveAndCollide();

                this.input = null;

                //if (ig.input.state('left')) {
                //    if (!ig.input.state('block')) {
                //        this.accel.x = -accel;
                //        this.flip = true;
                //    }
                //}
                //else if (ig.input.state('right')) {
                //    if (!ig.input.state('block')) {
                //        this.accel.x = accel;
                //        this.flip = false;
                //    }
                //}
                //else if (ig.input.pressed('jump')) {
                //    this.vel.y = -this.jump;
                //}
                //else {
                //    this.accel.x = 0;
                //}
                //if (this.climbing === false) {
                //    this.friction.y = 0;
                //    this.gravityFactor = 1;
                //    if (ig.input.state('left')) {
                //        if (!ig.input.state('block')) {
                //            this.accel.x = -accel;
                //            this.flip = true;
                //        }
                //    }
                //    else if (ig.input.state('right')) {
                //        if (!ig.input.state('block')) {
                //            this.accel.x = accel;
                //            this.flip = false;
                //        }
                //    }
                //    else if (this.standing && ig.input.pressed('jump')) {
                //        this.friction.y = 0;
                //        this.gravityFactor = 1;
                //        this.vel.y = -this.jump;
                //
                //    }
                //    else if (ig.input.state('up')){
                //        if(this.overLadder){
                //            this.getOnLadder();
                //            this.climbing = true;
                //            this.gravityFactor = 0;
                //            this.friction.y = 600;
                //        }
                //    }
                //    else if(ig.input.state('down')){
                //        if(this.overLadder){
                //            this.getOnLadder();
                //            this.climbing = true;
                //            this.gravityFactor = 0;
                //            this.friction.y = 600;
                //        }
                //    }
                //    else {
                //        this.friction.y = 0;
                //        this.gravityFactor = 1;
                //        this.accel.x = 0;
                //        //this.vel.y = 0;
                //    }
                //
                //    if (this.vel.y < 0) {
                //        this.isBlocking = false;
                //        this.isAttacking = false;
                //        if (this.flip === false)
                //            this.currentAnim = this.anims.jumpRight;
                //        else
                //            this.currentAnim = this.anims.jumpLeft;
                //    }
                //    else if (this.vel.y > 0) {
                //        this.isBlocking = false;
                //        if (this.flip === false)
                //            this.currentAnim = this.anims.fallRight;
                //        else
                //            this.currentAnim = this.anims.fallLeft;
                //    }
                //    else if (this.vel.x != 0) {
                //        this.isBlocking = false;
                //        this.isAttacking = false;
                //
                //        if (ig.input.pressed('jump')) {
                //            this.friction.y = 0;
                //            this.gravityFactor = 1;
                //            this.vel.y = -this.jump;
                //
                //            if (this.flip === false)
                //                this.currentAnim = this.anims.jumpRight;
                //            else
                //                this.currentAnim = this.anims.jumpLeft;
                //        } else {
                //            if (this.flip === false)
                //                this.currentAnim = this.anims.runRight;
                //            else
                //                this.currentAnim = this.anims.runLeft;
                //        }
                //    }
                //    else {
                //        if (ig.input.state('hit')) {
                //
                //            if (!this.isBlocking) {
                //                if (this.flip === false) {
                //                    this.currentAnim = this.anims.hitRight;
                //                    this.currentAnim = this.anims.swordRight;
                //                }
                //                else {
                //                    this.currentAnim = this.anims.hitLeft;
                //                    this.currentAnim = this.anims.swordLeft;
                //                }
                //                while (this.atkCount) {
                //                    this.isAttacking = true;
                //                    ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {flip: this.flip});
                //                    this.atkCount--;
                //                }
                //            }
                //        }
                //        else if (ig.input.state('block')) {
                //            this.isBlocking = true;
                //            this.isAttacking = false;
                //            if (this.flip == false)
                //                this.currentAnim = this.anims.blockRight;
                //            else
                //                this.currentAnim = this.anims.blockLeft;
                //        }
                //        else {
                //            //this.accel.x = 0;
                //            this.isBlocking = false;
                //            this.isAttacking = false;
                //            if (this.flip === false)
                //                this.currentAnim = this.anims.idleRight;
                //            else
                //                this.currentAnim = this.anims.idleLeft;
                //        }
                //    }
                //}
                //else {
                //    this.gravityFactor = 0;
                //    this.currentAnim = this.anims.climb;
                //    this.isAttacking = false;
                //    this.isBlocking = false;
                //    if(!ig.input.state('jump')) {
                //        if (ig.input.pressed('left')) {
                //            if (this.overLadder) {
                //                this.climbing = false;
                //                this.standing = true;
                //                this.gravityFactor = 1;
                //            }
                //            else {
                //                this.jumpOffLadder('left');
                //                this.friction.y = 0;
                //                this.gravityFactor = 1;
                //            }
                //        }
                //        else if (ig.input.pressed('right')) {
                //            if (this.overLadder) {
                //                this.climbing = false;
                //                this.standing = true;
                //                this.friction.y = 0;
                //                this.gravityFactor = 1;
                //            }
                //            else {
                //                this.jumpOffLadder('right');
                //                this.gravityFactor = 1;
                //            }
                //        }
                //        else if (ig.input.pressed('up')) {
                //            if (this.atTopOfLadder()) {
                //                this.climbing = false;
                //                this.standing = true;
                //                this.gravityFactor = 1;
                //                this.friction.y = 0;
                //            }
                //            else if (this.overLadder) {
                //                this.getOnLadder();
                //                this.gravityFactor = 0;
                //                this.friction.y = 600;
                //            }
                //            else {
                //                this.accel.y = -accel;
                //            }
                //        }
                //        else if (ig.input.pressed('down')) {
                //            if (this.atBottomOfLadder()) {
                //                this.climbing = false;
                //                this.standing = true;
                //            }
                //            else if (this.overLadder) {
                //                this.getOnLadder();
                //                this.gravityFactor = 0;
                //                this.friction.y = 600;
                //            }
                //            else {
                //                this.accel.y = accel;
                //                this.gravityFactor = 0;
                //                this.friction.y = 600;
                //            }
                //        }
                //        else if (ig.input.pressed('jump')) {
                //            this.gravityFactor = 1;
                //            this.friction.y = 0;
                //            this.jumpOffLadder('right');
                //        }
                //        else {
                //            //this.vel.y = 0;
                //            this.vel.x = 0;
                //        }
                        //if (this.vel.y != 0) {
                        //    if (this.currentAnim == this.anims.climb)
                        //        this.currentAnim.timer.unpause;
                        //    else
                        //        this.currentAnim = this.anims.climb;
                        //    if (this.vel.y < 0) {
                        //        if (this.atBottomOfLadder()) {
                        //            this.climbing = false;
                        //            this.standing = true;
                        //            this.gravityFactor = 1;
                        //            this.friction.y = 0;
                        //        }
                        //    }
                        //    else {
                        //        if (this.atTopOfLadder()) {
                        //            this.climbing = false;
                        //            this.gravityFactor = 1;
                        //            this.friction.y = 0;
                        //        }
                        //    }
                        //}
                        //else{
                        //    this.currentAnim.timer.pause();
                        //}
                    //}
                    //else{
                    //    this.gravityFactor = 1;
                    //    this.friction.y = 0;
                    //    this.climbing = false;
                    //}
                    //if (this.climbing && this.anims.climb) {
                    //    this.isBlocking = false;
                    //    this.isAttacking = false;
                    //    this.currentAnim = this.anim.climb;
                    //}
                //}

                if (this.invincibleTimer.delta() > this.invincibleDelay) {
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }

                //if(this.canClimb){
                //    this.checkForLadder(this);
                //    //this.currentAnim = this.anims.climb;
                //    if(this.touchLadderTimer.delta() > 0)
                //        this.isTouchingLadder = false;
                //    else {
                //        if(this.isClimbing && (ig.input.state('up') || ig.input.state('down'))) {
                //            if(this.currentAnim.timer.pause()){
                //                this.currentAnim.timer.unpause();
                //            }
                //            else
                //                this.currentAnim = this.anim.climb;
                //        }
                //        if (this.isClimbing && (!ig.input.state('up') || !ig.input.state('down'))) {
                //            this.current.anim.pause();
                //        }
                //    }
                //}

                //this.currentAnim.flip.x = this.flip;
                this.parent();
            }, //update

            stop: function(){
                this.vel.x = 0;
                this.vel.y = 0;
            },

            handleMovementTrace: function (res) {
                if (this.overLadder)
                    this.standing = true;
                if(res.collision.y) {
                    this.standing = true;
                    this.climbing = false;
                    this.gravityFactor = 1;
                    this.friction.y = 0;
                }
                if(res.collision.x){
                    this.standing = true;
                    this.climbing = false;
                    this.gravityFactor = 1;
                    this.friction.y = 0;
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
                }

               // if (this.possibleLandOnEntity && this.standing && this.overLadder)
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