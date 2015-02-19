ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
        EntityPlayer = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Hero.png', 32, 32),
            size: {x:8, y:14},
            offset: {x:4, y:2},
            flip: false,
            maxVel: {x:100, y:150},
            friction: {x:600, y:0},
            accelGround: 400,
            accelAir: 200,
            jump: 200,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            //weapon: 0,
            //totalWeapons: 2,
            //activeWeapon: "EntityBullet",
            startPosition: null,
            invincible: true,
            invincibleDelay: 2,
            invincibleTimer: null,

            init: function(x, y, settings){
                this.startPosition = {x:x, y:y};
                this.parent(x, y, settings);
                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();

                //this.setupAnimation(this.weapon);
            },

            kill: function(){
                this.parent();
                var x = this.startPosition.x;
                var y = this.startPosition.y;
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity(EntityPlayer, x, y)}});
            },

            makeInvincible: function(){
                this.invincible = true;
                this.invincibleTimer.reset();
            },

            receiveDamage: function(amount, from){
                if(this.invincible)
                    return;
                this.parent(amount, from);
            },

            draw: function(){
                if(this.invincible)
                    this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
                this.parent();
            },

            setupAnimation: function(offset){
                offset = offset * 10;
                this.addAnim('idleLeft', 1, [0+offset]);
                this.addAnim('idleRight', 1, [16+offset]);
                this.addAnim('runRight', .07, [0+offset,1+offset,2+offset,3+offset]);
                this.addAnim('runLeft', .07, [16+offset,17+offset,18+offset,19+offset]);
                this.addAnim('jumpRight', 1, [9+offset, 10+offset]);
                this.addAnim('jumpLeft', 1, [28+offset, 29+offset]);
                this.addAnim('fallRight', 0.4, [10+offset]);
                this.addAnim('fallLeft', 0.4, [29+offset]);
                this.addAnim('swimRight', 0.07, [7+offset, 8+offset]);
                this.addAnim('swimLeft', 0.07, [23+offset,24+offset]);
                this.addAnim('swingRight', 0.07, [11+offset, 12+offset, 13+offset]);
                this.addAnim('swingLeft', 0.07, [25+offset, 26+offset, 27+offset]);
                this.addAnim('hitRight', 1, [4+offset, 5+offset]);
                this.addAnim('hitLeft', 1, [20+offset,21+offset]);
                this.addAnim('blockRight', 1, [6+offset]);
                this.addAnim('blockLeft', 1, [22+offset]);
                this.addAnim('climbUp', 0.07, [32+offset,33+offset,34+offset,35+offset]);
                this.addAnim('climbDown', 0.07, [32+offset,33+offset,34+offset,35+offset]);
                this.addAnim('deathAnimationRight', 0.07, [14+offset, 15+offset]);
                this.addAnim('deathAnimationLeft', 0.07, [30+offset, 31+offset]);
            },

            update: function() {
                //left or right
                var accel = this.standing ? this.accelGround : this.accelAir;
                if(ig.input.state('left')){
                    this.accel.x = -accel;
                    this.flip = true;
                }
                else if(ig.input.state('right')){
                    this.accel.x = accel;
                    this.flip = false;
                }
                else{
                    this.accel.x = 0;
                }

                if(this.standing && ig.input.pressed('jump')){
                    this.vel.y = -this.jump;
                }

                if(ig.input.pressed('hit')){
                    if(this.flip === false)
                        this.currentAnim = this.anims.hitRight;
                    else
                        this.currentAnim = this.anims.hitLeft;
                }
                if( ig.input.pressed('switch') ) {
                    this.weapon++;
                    if (this.weapon >= this.totalWeapons)
                        this.weapon = 0;
                    switch (this.weapon) {
                        case(0):
                            this.activeWeapon = "EntityBullet";
                            break;
                        case(1):
                            this.activeWeapon = "EntityGrenade";
                            break;
                    }
                    this.setupAnimation(this.weapon);
                }
                if(this.vel.y > 0) {
                    if(this.flip === false)
                        this.currentAnim = this.anims.jumpRight;
                    else
                        this.currentAnim = this.anims.jumpLeft;
                }
                else if(this.vel.y < 0) {
                    if(this.flip === false)
                        this.currentAnim = this.anims.fallRight;
                    else
                        this.currentAnim = this.anims.fallLeft;
                }
                else if(this.vel.x != 0) {
                    if(this.flip === false)
                        this.currentAnim = this.anims.runRight;
                    else
                        this.currentAnim = this.anims.runLeft;
                }
                else {
                    if (this.flip === false)
                        this.currentAnim = this.anims.idleRight;
                    else
                        this.currentAnim = this.anims.idleLeft;
                }

                if(this.invincibleTimer.delta() > this.invincibleDelay){
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }

                //this.currentAnim.flip.x = this.flip;
                this.parent();
            }
        });

    });