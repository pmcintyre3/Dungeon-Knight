/**
 * Created by Phillip McIntyre on 2/22/2015.
 */
ig.module(
    'game.entities.skeleton'
)
    .requires(
    'impact.entity'
)
    .defines(function(){
        EntitySkeleton = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Skeleton.png', 32, 32),
            size: {x:16, y:32},
            offset: {x:8, y:0},
            flip: false,
            maxVel: {x:300, y:150},
            friction: {x:600, y:0},
            speed: 28,
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                //this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.1, [0,1,2]);
            },
            update: function() {
                if(!ig.game.collisionMap.getTile(
                        this.pos.x + (this.flip ? +4 : this.size.x -4),
                        this.pos.y + this.size.y+1
                    )
                ) {
                    this.flip = !this.flip;
                }
                if(this.vel.y == 0) {
                    var xdir = this.flip ? -1 : 1;
                    this.vel.x = this.speed * xdir;
                    this.currentAnim.flip.x = this.flip;
                }
                this.parent();
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x){
                    this.flip = !this.flip;
                }
            },
            check: function(other){
                if(!other.isBlocking)
                    other.receiveDamage(5, this);
                else{
                    if(this.pos.x < other.pos.x){
                        this.vel.x = - this.maxVel.x / 2;
                        this.vel.y = - this.maxVel.y / 3;
                        //this.accel.x = -500;
                    }
                    else {
                        this.vel.x = this.maxVel.x / 2;
                        this.vel.y = - this.maxVel.y / 3;
                        //this.accel.x = 500;
                    }
                }
            }
        });
    });