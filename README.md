______                                      _   __      _       _     _   
|  _  \                                    | | / /     (_)     | |   | |  
| | | |_   _ _ __   __ _  ___  ___  _ __   | |/ / _ __  _  __ _| |__ | |_ 
| | | | | | | '_ \ / _` |/ _ \/ _ \| '_ \  |    \| '_ \| |/ _` | '_ \| __|
| |/ /| |_| | | | | (_| |  __/ (_) | | | | | |\  \ | | | | (_| | | | | |_ 
|___/  \__,_|_| |_|\__, |\___|\___/|_| |_| \_| \_/_| |_|_|\__, |_| |_|\__|
                    __/ |                                  __/ |          
                   |___/                                  |___/           

# Dungeon-Knight
HTML5/Javascript game made with the impactJS engine

## Author
Phillip McIntyre
3/5/2015
pmcin3@uga.edu
github.com/pmcintyre3

## Description
Dungeon Knight is a 2D sidescrolling game that follows a young
warrior in his quest to rid his homeland of evil. He runs into
battle wearing his trusted armor and his faithful sword and shield,
but that alone will not help him triumph over the invaders. A wizard
appears to him throughout his journey sharing knowledge of the arcane,
and with these new powers, the warrior bests the odds and emerges
victorious.

## Objective
The objective of the game is to make it through three levels of combat.
Between each level, a wizard will meet the player and grant him a spell
as well as increasing his max health. The last level has harder enemies,
which makes use of the increased damage that the spells have. Upon making
it to the end, a splash screen will pop up and notify the user of their 
victory before prompting them to try again. Losing all three lives will
result in a game over and will force the player to start at the beginning.

## How to Play
The controls are simple! To move, you may use the arrow keys or the 
'WASD'keys. Left and right will move you in those respective directions, 
and spacebar will allow you to jump. When standing over vines (a ladder), 
pressing 'Up' will allow you to mount the ladder, and you will now be able 
to use 'Up' and 'Down' to move up and down the ladder. Pressing 'Left' or 
'Right' while on the ladder will cause you to jump off. You may also use 
'Spacebar' to jump off of the ladder. When swimming, press the 'Spacebar' 
to kick up towards the surface, and use 'Left' and 'Right' to move in those 
directions. To swing, simply run or jump towards a rope, and it will move you 
through the swing.
	
To attack, press the 'C' key. Your standard attack is the sword. You may 
block at any time by pressing the 'Z' key. You cannot block and attack at the 
same time, nor can you move and attack. Along the way, a wizard will grant you 
the ability to use two different spells - a lightning attack and a fireball 
attack. The fireball attack shoots three slightly stronger fireballs in the 
direction you are facing. The lightning bolt attack spawns two lightning bolts
that shoot away from you and diagonally upwards. Pressing 'X' will allow you 
to switch between the two spells and your sword and shield. Utilize all three
of these attacks, as well as your shield, to make it through the game.

There are screenshots of the game located in your
'Drive: /path-to-project/Dungeon-Knight/media/ScreenShots' folder.

## To Run
This game requires XAMPP, or some form of program that provides a local web 
server and Apache. In XAMPP, paste the 'Dungeon-Knight' folder in your 'htdocs'
folder. Then, in a web browser, enter the following in your address bar:

    localhost/Dungeon-Knight/index.html
	
> Some computers require you to manually insert your port number after 'localhost'.

## Graphical Objects
The graphical objects include the player, the wizard, the three enemy types,
and the world pieces. The player can spawn three fireballs or two bolts of
lightning at once, and the "Boss" enemies shoot sharp horns at the player.

##Required Files

* Graphical
'3DHero.png' - Top-down player model

'3DOutdoorTiles.png' - Top-down level design pieces

'04b03.font' - native font type

'blood.png' - zombie and player blood for when they are attacked

'boss.png' - spritesheet for the "boss" enemy

'Clouds.png' - the cloud layer of the parallax in the first level

'CloudsDark.png' - the darker variant of Clouds.png for the final level

'Crest.png' - part of the start screen

'DarkSky.png' - Sky variant for the last level

'EveningSky.png' - Sky variant for the second level

'explosion.png' - spritesheet for exploding entities

'Fireball.png' - spritesheet for the hero's fireball spell

'FireballElement.png'- Icon to show currently selected spell is fireball

'Healthbar.png' - spritesheet for player's healthbar

'Hero.png' - spritesheet for the main hero

'LightningElement.png' - Icon to show currently selected spell is lightning

'Moon.png' - reskinned variant of the sun sprite. Used in final level

'Mountains.png' - mountanous middle parallax layer

'MountainsDark.png' - the 3rd level variant of Mountains.png

'OutdoorTiles.png' - Tiles used to construct first and second levels

'OutdoorTiles2.png' - Tiles used to construct third level

'screen-bg.png' - background for start screen

'ShootLightning.png' - spritesheet used for shooting lightning spell

'Skeleton.png' - spritesheet for Skeleton entity

'Sky.png' - used to paint the sky in the first level

'smallStar.png' - used as a life counter for player

'spike.png' - the "boss" enemy shoots these at the player

'stat-matte.png' - used as a background for the splash screens

'Sun.png' - used to picture the sun in levels one and two

'SwordShield.png' -  to show player that no spells are selected

'Wizard.png' - friendly sprite for the player

'Zombie.png' - spritesheet for enemy unit

* Non-Graphical

'main.js' - driver used for the game and screens

'boss.js' - file containing "boss" enemy's AI

'gamewin.js' - used to toggle the win-state for player

'kill.js' - used to instant-kill entities when they fall

'ladder.js' - entity to toggle a climbing state for the player

'levelexit.js' - used to transition the player between levels

'player.js' - contains all of the conditional variables and controls for player

'player3d.js' - all the controls for the top-down perspective

'rope.js' used to toggle when the player swings

'skeleton.js' - file containing the skeleton's AI

'water.js' - entity to toggle when the player swims

'wizard.js' - handles the AI for the wizard

'zombie.js' - handles the AI for the zombie

> all other files are included in the impactJS engine, which is also required to run the game

> This project is also available on GitHub at github.com/pmcintyre3/Dungeon-Knight

> All music files are under copyright of their respective owners. I do not own any of them.