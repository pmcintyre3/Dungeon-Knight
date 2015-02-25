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
           update: function() {},

           draw: function() { this.parent();
               //if(!ig.global.wm){
               //    if(this.currentAnim){
               //        var tilesize = ig.game.collisionMap.tilesize;
               //        var tileHeight = this.size.y / tilesize;
               //        for(var i = 1; i < tileHeight; i++){
               //            this.currentAnim.draw(
               //                this.pos.x - this.offset.x - ig.game._rscreen.x,
               //                this.pos.y - this.offset.y - ig.game._rscreen.y + (i * tilesize)
               //            );
               //        }
               //    }
               //    this.parent();
               //}
           },
           check: function(other){
               if(other instanceof EntityPlayer){
                   other.climbing = true;
               }

               this.parent(other);
           }


           //spriteId: 0,
           //ladderSpeed: 100,
           //gravityFactor: 0,
           //eligibleClimbers: [],
           //zIndex: 3,
           //checkAgainst: ig.Entity.TYPE.A,
           //collides: ig.Entity.COLLIDES.NONE,
           //
           //init: function(x, y, settings) {
           //    this.parent(x, y, settings);
           //    if(settings.id != undefined)
           //         this.spriteId = settings.id;
           //},
           //update: function(){
           //    this.eligibleClimber = [ig.game.player];
           //    if(!this.eligibleClimber.canClimb)
           //         this.makeEligible();
           //},
           //makeEligible: function(){
           //    if(ig.global.wm)
           //         return;
           //    if(this.eligibleClimber[0].canClimb == undefined) {
           //        this.eligibleClimber[0].zIndex = this.zIndex + 1;
           //        this.configureForClimbing(this.eligibleClimber[0]);
           //    }
           //},
           //
           //draw: function() {
           //    this.parent();
           //},
           //
           //check: function(other){
           //        if(other.configureForClimbing){
           //            other.touchLadderTimer.set(0.1);
           //            other.isTouchingLadder = true;
           //            if(other.releaseLadderTimer.delta() > -0.1){
           //                if(other.vel.y < 0 && other.momentumDirection.y != -1){
           //                    other.isClimbing = true;
           //                }
           //                else{
           //                    if(other.isClimbing && other.momentumDirection.y != 0){
           //                        if(other.ladderSpeed)
           //                            this.ladderSpeed = other.ladderSpeed;
           //                        other.vel.y = this.ladderSpeed * other.momentumDirection.y;
           //                    }
           //                    else{
           //                        other.momentumDirection.y = 0;
           //                        other.vel.y = 0;
           //                        other.pos.y = other.last.y;
           //                    }
           //                    if(other.momentumDirection.y == 1 && other.pos.y == other.last.y){
           //                        other.momentumDirection.y = 0;
           //                        other.isClimbing = false;
           //                    }
           //                }
           //            }
           //            else {
           //                other.isTouchingLadder = false;
           //            }
           //        }
           //},
           //configureForClimbing: function(anEntity){
           //    anEntity.canClimb = true;
           //    anEntity.isTouchingLadder = false;
           //    anEntity.momentumDirection = {x: 0, y: 0};
           //    anEntity.releaseLadderTimer = new ig.Timer(0.0);
           //    anEntity.touchLadderTimer = new ig.Timer(0.0);
           //    anEntity.ladderSpeed = this.ladderSpeed;
           //    anEntity.zIndex = this.zIndex + 1;
           //
           //    anEntity.checkForLadder = function(entity){
           //        if(entity == ig.game.player){
           //            var accel = entity.standing ? entity.accelGround : entity.accelAir;
           //            if(ig.input.state('left')) {
           //                entity.momentumDirection.x = -1;
           //                entity.accel.x = -accel;
           //                entity.flip = true;
           //                if(!entity.isTouchingLadder){
           //                    entity.isClimbing = false;
           //                }
           //            }
           //            else if (ig.input.state('right')){
           //                entity.momentumDirection.x = 1;
           //                entity.accel.x = accel;
           //                entity.flip = false;
           //                if(!entity.isTouchingLadder){
           //                    entity.isClimbing = false;
           //                }
           //            }
           //            else
           //                entity.accel.x = 0;
           //
           //            if(entity.isTouchingLadder && (ig.input.pressed('up') || ig.input.pressed('down'))){
           //                entity.isClimbing = true;
           //                entity.releaseLadderTimer.set(0.0);
           //                entity.vel.x = 0;
           //
           //                if(ig.input.pressed('up')){
           //                    entity.momentumDirection.y > -1 ? entity.momentumDirection.y-- : entity.momentumDirection.y = -1;
           //                }
           //                else if(ig.input.pressed('down')){
           //                    entity.momentumDirection.y < 1 ? entity.momentumDirection.y++ : entity.momentumDirection.y = 1;
           //                }
           //            }
           //            if((entity.standing || entity.isClimbing || entity.isTouchingLadder) && ig.input.pressed('jump')){
           //                entity.vel.y = -entity.jump;
           //                entity.releaseLadderTimer.set(0.8);
           //                entity.isClimbing = false;
           //            }
           //            if(!entity.standing && !entity.isTouchingLadder && entity.vel.y < 0){
           //                entity.isClimbing = false;
           //            }
           //            if(entity.standing){
           //                entity.releaseLadderTimer.set(0.0);
           //            }
           //        }
           //    }
           //}
       });
    });