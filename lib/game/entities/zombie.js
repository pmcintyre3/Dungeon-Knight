/**
 * Created by Phillip on 3/4/2015.
 */
/**
 * Created by Phillip McIntyre on 2/22/2015.
 */
ig.module(
    'game.entities.zombie'
)
    .requires(
    'impact.entity'
)
    .defines(function(){
        EntityZombie = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Zombie.png', 32, 32),
            size: {x:16, y:32},
            offset: {x:8, y:0},
            flip: false,
            maxVel: {x:300, y:150},
            friction: {x:600, y:0},
            speed: 15,
            health: 25,
            maxHealth: 25,
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                //animation
                this.addAnim('walk', 0.1, [0,1,2,3]);
            },
            update: function() {
                //if it can't detect collision tile in front of it
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
            //flip when it hits a wall
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x){
                    this.flip = !this.flip;
                }
            },
            //spawn "blood" when hit
            receiveDamage: function(value){
                this.parent(value);
                if(this.health > 0)
                    ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles:
                        2, colorOffset: 1});
            },
            //spawn blood when killed
            kill: function(){
                this.parent();
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset:
                    1});
            },

            collideWith: function(other, axis) {
                if (other instanceof EntityPlayer && !(other instanceof EntityBullet)) {
                    //killed when jumped on
                    if (axis == 'y') {
                        other.vel.y = -other.jump / 2;

                        this.kill();
                    }
                    else {
                        //enable blocking
                        if (other.isBlocking) {
                            if (other.pos.x < this.pos.x) {
                                this.vel.x = 100;
                                this.vel.y = -75;
                            }
                            else {
                                this.vel.x = -100;
                                this.vel.y = -75;
                            }
                        }
                        else {
                            //regular damage
                            other.receiveDamage(12, this);
                            other.isHurt = true;
                            if (other.pos.x < this.pos.x) {
                                other.vel.x = -100;
                                other.vel.y = -75;
                            }
                            else {
                                other.vel.x = -100;
                                other.vel.y = -75;
                            }
                        }
                    }
                }
                //flips when it collides with another enemy
                if (other instanceof EntitySkeleton || other instanceof EntityZombie) {
                    this.flip = !this.flip;
                    //other.flip = !other.flip;
                }
                //knockback
                if (other instanceof EntityBullet) {
                    if (other.pos.x < this.pos.x) {
                        this.vel.x = 80;
                        this.vel.y = -50;
                    }
                    else {
                        this.vel.x = -80;
                        this.vel.y = -50;
                    }
                }
            }
        });
    });