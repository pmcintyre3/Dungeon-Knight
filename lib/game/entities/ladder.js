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
           size: {x: 16, y: 16},
           realWidth: 10,
           nature: 'ladder',
           gravityFactor: 0,
           input: null,
           zIndex: 3,

           init: function(x,y, settings){
               this.parent(x, y, settings);
               if(!ig.global.wm){
                   var offset = (this.size.x - this.realWidth) / 2;
                   this.offset.x = offset;
                   this.size.x = this.realWidth;
                   this.pos.x += offset;
               }
           },
           update: function() {
               this.parent();
           },

           draw: function() {
               this.parent();
           },
           check: function(other){
               if(other instanceof EntityPlayer){
                   other.climbing = true;
               }

               this.parent(other);
           }
       });
    });