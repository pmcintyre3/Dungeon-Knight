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
            //gravityFactor: 0.3,
            input: null,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
            },
            check: function(other) {
                other.swimming = true;
            },
            draw: function(){
                var x = (this.pos.x) * ig.system.scale;
                var y = (this.pos.y) * ig.system.scale;
                ig.system.context.fillStyle = 'rgba(0, 191, 243, 0.5)';
                ig.system.context.fillRect(x, y,(this.size.x) * ig.system.scale, (this.size.y) * ig.system.scale);
            }
        });
    });