/**
 * Created by Phillip on 2/28/2015.
 */
ig.module(
    'game.entities.rope'
)
.requires(
    'impact.entity'
    //'plugins.box2d.game',
    //'plugins.box2d.entity'
)
.defines(function(){
       EntityRope = ig.Entity.extend({
           _wmDrawBox: true,
           _wmBoxColor: 'rgba(50, 50, 50, 0.7)',
           _wmScalable: true,
           zIndex: 1,
           drawToPlayer: false,
           input: null,
           checkAgainst: ig.Entity.TYPE.A,
           player: null,
           playerX: 0,
           playerY: 0,
           playerSizeX: 0,
           playerSizeY: 0,

           init: function(x, y, settings) {
               this.parent(x, y, settings);
           },
           draw: function(){
               var startX, startY;
               var endX, endY;

               if(this.player && this.drawToPlayer){
                   startX = ig.system.getDrawPos((this.pos.x + (this.size.x / 2)) - ig.game.screen.x);
                   startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);

                   endX = ig.system.getDrawPos((this.playerX + (this.playerSizeX / 2)) - ig.game.screen.x);
                   endY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);
               }
               else if(!this.drawToPlayer){
                   startX = ig.system.getDrawPos((this.pos.x + (this.size.x / 2)) - ig.game.screen.x);
                   startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);

                   endX = ig.system.getDrawPos(startX);
                   endY = ig.system.getDrawPos((startY + this.size.y) - ig.game.screen.y);
               }

               ig.system.context.strokeStyle = 'brown';
               ig.system.context.beginPath();
               ig.system.context.moveTo(startX, startY);
               ig.system.context.lineTo(endX, endY * ig.system.scale);
               ig.system.context.stroke();
               ig.system.context.closePath();
               this.parent();
           },
           update: function(){
               if(this.player != null){
                   this.drawToPlayer = true;
                   this.playerX = this.player.pos.x;
                   this.playerY = this.player.pos.y;
                   this.playerSizeX = this.player.size.x;
                   this.playerSizeY = this.player.size.y;
               }

               this.parent();
           },
           check: function(other){
               if(other instanceof EntityPlayer){
                   this.player = other;
                   this.playerX = other.pos.x;
                   this.playerY = other.pos.y;
                   this.playerSizeX = other.size.x;
                   this.playerSizeY = other.size.y;
                   other.swinging = true;
                   this.drawToPlayer = true;
               }
               else{
                   //other.swinging = false;
                   this.drawToPlayer = false;
               }
               this.parent(other);
           }
       });
    });