/**
 * Created by Phillip McIntyre on 2/24/2015.
 */
ig.module(
    'game.entities.ladder'
)
.requires(
    'impact.entity'
)
.defines(function() {
       EntityLadder = ig.Entity.extend({
           _wmDrawBox: true,
           _wmBoxColor: 'rgba(255, 255, 0, 0.7',
           _wmScalable: true,
           checkAgainst: ig.Entity.TYPE.A,
           collides: ig.Entity.COLLIDES.NONE,

           init: function(x, y, settings) {
               this.parent(x, y, settings);
           }

       });
    });