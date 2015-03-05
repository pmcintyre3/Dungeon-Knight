ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
    'impact.font',
    'game.levels.test',
    'game.levels.Glade',
    'game.levels.overworld1',
    'game.levels.Forest',
    'game.levels.overworld2',
    'game.levels.Dark',
    'impact.debug.debug'
    //'plugins.box2d.entity',
    //'plugins.box2d.game'
)
.defines(function(){

    MyGame = ig.Game.extend({

        // Load a font
        font: new ig.Font( 'media/04b03.font.png' ),
        healthBar: new ig.Image('media/HealthBar.png', 16, 128),
        currWeapon: null,
        currLevel: null,
        sword: new ig.Image('media/SwordShield.png', 32, 32),
        fire: new ig.Image('media/FireElement.png', 32, 32),
        lightning: new ig.Image('media/LightningElement.png', 32, 32),
        gravity: 300,
        numWeapons: 1,
        numHealth: 20,
        upText: "",
        upFont: new ig.Font("media/04b03.font.png"),
        is3D: false,
        player: null,
        init: function() {
            // Initialize your game here; bind keys etc.
            //Bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            ig.input.bind(ig.KEY.A, 'left');
            ig.input.bind(ig.KEY.D, 'right');
            ig.input.bind(ig.KEY.W, 'up');
            ig.input.bind(ig.KEY.S, 'down');
            ig.input.bind(ig.KEY.SPACE, 'jump');
            ig.input.bind(ig.KEY.C, 'hit');
            ig.input.bind(ig.KEY.Z, 'block');
            ig.input.bind(ig.KEY.X, 'swap');

            //levels
            //this.loadLevel(LevelTest);
            this.currLevel = LevelForest;
            this.loadLevel(this.currLevel);


        },

        update: function() {
            //var player;
            if(this.is3D)
                this.player = ig.game.player3d;
            else
                this.player = ig.game.player;
            if(this.player){
                this.player.totalWeapons = this.numWeapons;
                this.player.maxHealth = this.numHealth;
                this.screen.x = this.player.pos.x - ig.system.width / 2;
                this.screen.y = this.player.pos.y - ig.system.height / 2;
            }
            // Update all entities and backgroundMaps
            this.parent();

            // Add your own, additional update code here
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();

            //health bar stuff
            //var p = this.getEntitiesByType(EntityPlayer)[0];
            //if(this.is3D)
            //    this.player = ig.game.player3d;
            //else
            //    this.player = ig.game.player;
            if(ig.game.player) {
                var xDim, yDim;
                switch(ig.game.player.weapon) {
                    //case 0: this.sword.drawTile(5, 30, 0, 32, 32, false, false); break;
                    //case 1: this.fire.drawTile(5, 30, 0, 32, 32, false, false); break;
                    //case 2: this.lightning.drawTile(5, 30, 0, 32, 32, false, false); break;
                    case 0: this.currWeapon = this.sword; break;
                    case 1: this.currWeapon = this.fire; break;
                    case 2: this.currWeapon = this.lightning; break;
                }
                this.currWeapon.drawTile(5, 30, 0, 32, 32, false, false);

                switch(ig.game.player.health){
                    case 20: this.healthBar.drawTile(5, 5, 0, 128, 16, false, false); break;
                    case 19: this.healthBar.drawTile(5, 5, 1, 128, 16, false, false); break;
                    case 18: this.healthBar.drawTile(5, 5, 2, 128, 16, false, false); break;
                    case 17: this.healthBar.drawTile(5, 5, 3, 128, 16, false, false); break;
                    case 16: this.healthBar.drawTile(5, 5, 4, 128, 16, false, false); break;
                    case 15: this.healthBar.drawTile(5, 5, 5, 128, 16, false, false); break;
                    case 14: this.healthBar.drawTile(5, 5, 6, 128, 16, false, false); break;
                    case 13: this.healthBar.drawTile(5, 5, 7, 128, 16, false, false); break;
                    case 12: this.healthBar.drawTile(5, 5, 8, 128, 16, false, false); break;
                    case 11: this.healthBar.drawTile(5, 5, 9, 128, 16, false, false); break;
                    case 10: this.healthBar.drawTile(5, 5, 10, 128, 16, false, false); break;
                    case 9: this.healthBar.drawTile(5, 5, 11, 128, 16, false, false); break;
                    case 8: this.healthBar.drawTile(5, 5, 12, 128, 16, false, false); break;
                    case 7: this.healthBar.drawTile(5, 5, 13, 128, 16, false, false); break;
                    case 6: this.healthBar.drawTile(5, 5, 14, 128, 16, false, false); break;
                    case 5: this.healthBar.drawTile(5, 5, 15, 128, 16, false, false); break;
                    case 4: this.healthBar.drawTile(5, 5, 16, 128, 16, false, false); break;
                    case 3: this.healthBar.drawTile(5, 5, 17, 128, 16, false, false); break;
                    case 2: this.healthBar.drawTile(5, 5, 18, 128, 16, false, false); break;
                    case 1: this.healthBar.drawTile(5, 5, 19, 128, 16, false, false); break;
                }
                if(ig.game.player3d) {
                    var x = ig.game.player3d.pos.x - ig.game.screen.x;
                    var y = (ig.game.player.pos.y - 10) - ig.game.screen.y;
                    this.upFont.draw(this.upText, x, y, ig.Font.ALIGN.CENTER);
                }
                //var healthBarWidth = pMaxHealth * 5;
                //
                ////health bar background
                //ig.system.context.fillStyle = 'rgb(20,20,20)';
                //ig.system.context.beginPath();
                //ig.system.context.rect(ig.game.screen.x - 20, ig.game.screen.y - 20, healthBarWidth, 10);
                //ig.system.context.closePath();
                //ig.system.context.fill();
                //
                ////health bar
                //ig.system.context.fillStyle = 'rgb(255,0,0)';
                //ig.system.context.beginPath();
                //ig.system.context.rect(22, 22, (healthBarWidth - 4) * (pHealth / pMaxHealth), 6);
                //ig.system.context.closePath();
                //ig.system.context.fill();
            }
        }
    });


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
