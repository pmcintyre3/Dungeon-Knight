/**
 * Created by Phillip on 3/4/2015.
 */
ig.module(
    'game.entities.player3d'
)
    .requires(
    'impact.entity'
)
    .defines(function() {
        EntityPlayer3d = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/3DHero.png', 16, 16),
            size: {x: 16, y: 16},
            flip: {x: false, y: false},
            //vel: {x: 0, y: 0},
            maxVel: {x: 100, y: 100},
            friction: {x: 1000, y: 1000},
            accelGround: 400,
            accelAir: 400,
            gravityFactor: 0,
            totalWeapons: 1,
            maxHealth: 25,
            lastInput: '',
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            startPosition: null,

            init: function(x, y, settings) {
                this.startPosition = {x: x, y: y};
                this.parent(x, y, settings);

                this.addAnim('idleXR', 1, [0]);
                this.addAnim('idleXL', 1, [8]);
                this.addAnim('idleYUp', 1, [3]);
                this.addAnim('idleYDown', 1, [6]);
                this.addAnim('runXR', 0.07, [0,1]);
                this.addAnim('runXL', 0.07, [8, 9]);
                this.addAnim('runYUp', 0.07, [2, 3, 4]);
                this.addAnim('runYDown', 0.07, [5, 6, 7]);

                ig.game.player3d = this;
            },

            update: function(){

                var accel = this.standing ? this.accelGround : this.accelAir;

                if(ig.input.state('up')) {
                    //if(this.vel.y == 0)
                    //    this.vel.y = -10;

                    this.accel.y = -accel;
                    this.vel.x = 0;
                    this.lastInput = 'up';
                }
                else if(ig.input.state('down')) {
                    //if(this.vel.y == 0)
                    //    this.vel.y = 10;

                    this.accel.y = accel;
                    this.vel.x = 0;
                    this.lastInput = 'down';
                }
                else if(ig.input.state('right')) {
                    //if(this.vel.x == 0)
                    //    this.vel.x = 10;
                    this.accel.x = accel;
                    this.vel.y = 0;
                    this.lastInput = 'right';
                }
                else if(ig.input.state('left')) {
                    //if(this.vel.x == 0)
                    //    this.vel.x = -10;
                    this.accel.x = -accel;
                    this.vel.y = 0;
                    this.lastInput = 'left';
                }
                else{
                    this.accel.x = 0;
                    this.accel.y = 0;
                }

                if(this.vel.y > 0){
                    this.flip.y = false;
                    this.currentAnim = this.anims.runYDown;
                }
                else if(this.vel.y < 0){
                    this.flip.y = true;
                    this.currentAnim = this.anims.runYUp;
                }
                else if(this.vel.x > 0){
                    this.flip.x = false;
                    this.currentAnim = this.anims.runXR;
                }
                else if(this.vel.x < 0){
                    this.flip.x = true;
                    this.currentAnim = this.anims.runXL;
                }
                else if(this.vel.y == 0 && this.vel.x == 0){
                    if(this.lastInput == 'up')
                        this.currentAnim = this.anims.idleYUp;
                    else if(this.lastInput == 'down')
                        this.currentAnim = this.anims.idleYDown;
                    else if(this.lastInput == 'right')
                        this.currentAnim = this.anims.idleXR;
                    else if(this.lastInput == 'left')
                        this.currentAnim = this.anims.idleXL;
                }

                this.parent();
            }
        });
    });