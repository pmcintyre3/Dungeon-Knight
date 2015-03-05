ig.module(
	'game.entities.levelexit'
)
.requires(
	'impact.entity'
)
.defines(function(){

    EntityLevelexit = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        _wmScalable: true,
        size: {x: 8, y: 8},
        level: null,
        checkAgainst: ig.Entity.TYPE.A,
        update: function(){},
        //check: function(other) {
        //	if (other instanceof EntityPlayer) {
        //		ig.game.toggleStats(this);
        //	}
        //},
        check: function() {
            console.log("Here!");
            ig.game.is3D = !ig.game.is3D;
            var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function (m, l, a, b) {
                return a.toUpperCase() + b;

            });
            ig.game.currLevel = 'Level' + levelName;
            console.log("currLevel: " + ig.game.currLevel);
            if (ig.game.wizard != null) {
                ig.game.wizard.giveWeapons = 1;
                console.log("Wizard weapon giving increased to: " + ig.game.wizard.giveWeapons);
            }
            ig.game.currentSong = (ig.game.currentSong + 1) % ig.game.totalSongs;
            ig.game.upText = "";
            ig.game.loadLevelDeferred(ig.global[ig.game.currLevel]);
        }
    });
});
