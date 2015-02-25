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
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
            },
            update: function(){},
            check: function(other) {
                other.kill();
            }
        });
    });