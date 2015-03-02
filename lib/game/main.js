ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
    'game.levels.test',
    'impact.debug.debug'
    //'plugins.box2d.entity',
    //'plugins.box2d.game'
)
.defines(function(){

    MyGame = ig.Game.extend({

        // Load a font
        font: new ig.Font( 'media/04b03.font.png' ),

        gravity: 300,
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

            //levels
            this.loadLevel(LevelTest);
        },

        update: function() {
            var player = this.getEntitiesByType(EntityPlayer)[0];
            if(player){
                this.screen.x = player.pos.x - ig.system.width / 2;
                this.screen.y = player.pos.y - ig.system.height / 2;
            }

            // Update all entities and backgroundMaps
            this.parent();

            // Add your own, additional update code here
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            //health bar stuff
            var player = this.getEntitiesByType(EntityPlayer)[0];
            if(player) {
                var pHealth = player.health;
                var pMaxHealth = player.maxHealth;
                var healthBarWidth = pMaxHealth * 5;

                //health bar background
                ig.system.context.fillStyle = 'rgb(20,20,20)';
                ig.system.context.beginPath();
                ig.system.context.rect(ig.game.screen.x - 20, ig.game.screen.y - 20, healthBarWidth, 10);
                ig.system.context.closePath();
                ig.system.context.fill();

                //health bar
                ig.system.context.fillStyle = 'rgb(255,0,0)';
                ig.system.context.beginPath();
                ig.system.context.rect(22, 22, (healthBarWidth - 4) * (pHealth / pMaxHealth), 6);
                ig.system.context.closePath();
                ig.system.context.fill();
            }
            this.parent();


            // Add your own drawing code here
            //var x = ig.system.width/2,
            //    y = ig.system.height/2;
            //
            //this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );


        }
    });


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
