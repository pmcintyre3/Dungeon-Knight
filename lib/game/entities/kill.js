/**
 * Created by Phillip McIntyre on 2/24/2015.
 */
ig.module(
    'game.entities.kill'
)
    .requires(
    'impact.entity'
)
    .defines(function() {
        EntityKill = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
            _wmScalable: true,
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.BOTH,
            //animSheet: new ig.AnimationSheet( 'media/FIREEE.png', 16, 16 ),
            //size: {x:16, y:16},
            init: function( x, y, settings ) {
                //this.addAnim('fire', .07, [0,1]);
                this.parent( x, y, settings );
            },
            update: function(){
                //this.currentAnim = this.anims.fire;
            },
            check: function(other) {
                other.kill();
            }
        });
    });