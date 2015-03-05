/**
 * Created by Phillip McIntyre on 2/22/2015.
 */
ig.module(
    'game.entities.boss'
)
    .requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function(){
        EntityBoss = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Boss.png', 64, 64),
            size: {x:64, y:64},
            flip: false,
            maxVel: {x:300, y:150},
            friction: {x:600, y:0},
            speed: 12,
            health: 200,
            maxHealth: 75,
            shootTimer: null,
            shootSFX: new ig.Sound("media/sounds/spike.ogg"),
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                //this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.1, [0,1,2,3]);
                this.shootTimer = new ig.Timer(2);
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
                if(this.distanceTo(ig.game.player) < 150 && this.shootTimer.delta() > 0){
                    if(ig.game.player.pos.x > this.pos.x)
                        ig.game.spawnEntity(EntityBossBullet, this.pos.x, this.pos.y, {flip: false});
                    else
                        ig.game.spawnEntity(EntityBossBullet, this.pos.x, this.pos.y, {flip: true});

                    this.shootSFX.play();
                }
                if(this.shootTimer.delta() > 0)
                    this.shootTimer.reset();

                this.parent();
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x){
                    this.flip = !this.flip;
                }
            },
            check: function(other) {
                if (!other.isBlocking)
                    other.receiveDamage(10, this);
            }
        });
        EntityBossBullet = ig.Entity.extend({
            size: {x:30, y:30},
            animSheet: new ig.AnimationSheet('media/spike.png', 32, 32),
            maxVel: {x:130, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x + (settings.flip ? -8 : 36), y + 16, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.alive = new ig.Timer(2);
                this.addAnim('shoot', 1, [0]);

                this.currentAnim.flip.x = !this.flip;
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    this.kill();
                }
                if(this.alive.delta() > 0)
                    this.kill();
            },
            check: function(other) {
                if(!other.isBlocking)
                    other.receiveDamage(12, this);
                this.kill();
            },
            receiveDamage: function(value){
                this.parent(value);
                if(this.health > 0)
                    ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles:
                        2, colorOffset: 1});
            },

            kill: function() {
                this.parent();
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
                    colorOffset: 1
                });
            }
        });
    });