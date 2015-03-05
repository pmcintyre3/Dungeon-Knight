/**
 * Created by Phillip on 3/5/2015.
 */
ig.module(
    'game.entities.gamewin'
)
    .requires(
    'impact.entity'
)
    .defines(function(){

        //toggles the win screen
        EntityGamewin = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(0, 255, 255, 0.7)',
            _wmScalable: true,
            size: {x: 8, y: 8},
            checkAgainst: ig.Entity.TYPE.A,
            update: function(){},
            check: function() {
                ig.game.currentSong = (ig.game.currentSong + 1) % ig.game.totalSongs;
                ig.game.isWin = true;
            }
        });
    });