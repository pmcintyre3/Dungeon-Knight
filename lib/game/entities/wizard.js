/**
 * Created by Phillip on 3/5/2015.
 */

ig.module(
    'game.entities.wizard'
)
    .requires(
    'impact.entity'
)
    .defines(function(){
        EntityWizard = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/Wizard.png', 16, 16),
            size: {x:16, y:16},
            flip: false,
            maxVel: {x:300, y:150},
            friction: {x:600, y:0},
            speed: 15,
            health: 25,
            maxHealth: 25,
            gravityFactor: 0,
            giveWeapons: 1,
            levelUpSFX: new ig.Sound('media/sounds/levelUp.ogg'),

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,
            infoText: "",
            isCollided: false,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);

                ig.game.wizard = this;
            },
            update: function(){
                this.parent();
                this.isCollided = false;
            },
            draw: function(){
                this.parent();

                if(this.isCollided){
                    ig.game.upText = "Health increased to:"  + ig.game.numHealth + "\nNumber of weapons increased to: " + ig.game.numWeapons;
                }
                //else
                //    ig.game.upText = "";
            },
            check: function(other) {
                //if (other instanceof EntityPlayer && !(other instanceof EntityBullet)) {
                //    other.health = other.maxHealth;
                //    console.log("Health maxed out at: " + other.health);
                //    if(this.giveWeapons > 0) {
                //        if (other.totalWeapons > 3) {
                //            other.totalWeapons = 3;
                //            console.log("Weapons maxed out at: " + other.totalWeapons);
                //        }
                //        else {
                //            other.totalWeapons++;
                //            console.log("Weapons up to: " + other.totalWeapons);
                //        }
                //        console.log("Weapons left to give: " + this.giveWeapons);
                //        this.giveWeapons--;
                //    }
                //}
                if(other == ig.game.player3d) {
                    if(this.giveWeapons > 0) {
                        ig.game.numWeapons++;
                        ig.game.numHealth += 10;
                        this.giveWeapons--;
                        this.levelUpSFX.play();
                        this.isCollided = true;
                    }
                }
                this.parent(other);
            }

        });
    });