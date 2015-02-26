/**
 * Created by Phillip McIntyre on 2/24/2015.
 */
ig.module(
    'game.entities.water'
)
    .requires(
    'impact.entity'
)
    .defines(function() {
        EntityWater = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(0, 0, 255, 0.7',
            _wmScalable: true,
            nature: 'water',
            checkAgainst: ig.Entity.TYPE.BOTH,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
            },
            check: function(other) {
                if (other instanceof EntityPlayer) {
                    other.swimming = true;
                }
            }


        });
    });