//ALL SPRITES MADE BY BRANDON WANG

//CREATION DATE: 2-10-16

//still need to image-ize: goomba, the text

//NOT IMPLEMENTED: KOOPA, GOOMBA GOOMBA INTERACTION, INVINCIBILITY, FIREFLOWER, ONE UP

//Click enter on the title screen to continue

//HIGHSCORES
/**

HIGH SCORES:

IAN         68300
JON         63650
RIT         059150
PAP         055600
IAN         055500
INO         054500

MOST TIME LEFT:

PAP         746

*/
//CONTROLS
/**

CONTROLS:
 * Arrow keys to move left and right
 * UP arrow to jump
 * "x" to superspeed

*/

//We attempted to make a sound system for this to play the music. I don't want to call it an epic fail, but it is a while before we try again. For now, please listen to this in the background:
/**
https://www.youtube.com/watch?v=aX4riDSN6f0
*/
//Notes regarding makers and experience
/**
This game was made by my friend Brandon and me.
Brandon was in charge of graphics (which are EXTREMELY accurate) and I am in charge of.... everything else

Pranav Patil
I've been programming 9 months, and I have learned 100% of Intro to JS.

Brandon Wang
I've been programming 4 months, and I have learned 40% of Intro to JS.


We made a program that re-creates the classic game called Super Mario Bros.
You can read more about it here: https://en.wikipedia.org/wiki/Super_Mario_Bros.
*/
//Other notes for Pamela
/**

                                                NOTES

Brandon and I strived to make this COMPLICATED progam as accurate as possible. We consistently put as much detail and accuracy into this program as we could. We did our best to NEVER take the easy way out. For this reason, we believe the only "inaccuracy" in this program is the fact that is never done! Estimated completion time? June. Now keep in mind this is maybe 3 weeks of hard work on our parts. We are in the middle of a lot of competition math and made this program in the time we had to spare! In addition, unlike many Khan Academy users, we are not homeschooled and have to deal with the many burdens our school work brings us. Please take this into consideration and realize that although we didn't have much time, we wrote 3300 lines of code in 3 weeks. That's about [counts on fingers] SEVEN LINES PER YEAR!!! (obviously we are doing excelling in mathematics, grammar too). I'm kidding though, it's about 6.5 lines per hour! Talk about hard work!!!!

PREPARE YOURSELF FOR SOME INTENSE CODING AWESOMENESS ONLY MATCHED (AND EASILY DEFEATED) BY THE GREATEST CODER OF THIS CENTURY (THAT'S YOU)

Now, enough of this multiline comment! Get to the code!!!! (which is filled with many MANY single lined comments!!!)

*/

//BEGIN CODE
size(400, 400);

frameRate(60);

//beginning variables

{

//x, y, xvel, yvel, left open, right open, down open, up open
var player = [50, 325, 0.01, 0, true, true, true, true];

//is dead? how long until alive?
var death = [false, 0];

//for the dying animation
var dying = [false, -10];

//variable for whether or not the title screen is up
var title = true;

//big, invincible, fireflower
var powerups = [true, false, false];

//a variable which is 25 when mario is bigger, in order to keep from haveing too much code (ifs)
var yInc = 0;

//a timer for how long mario is invincible
var invincible = 0;

//a timer for the few frames mario has to recover
var recover = 0;

//whether or not he is jumping (used for the sprites)
var jump = false;

//the directional mario faces
var goingLeft = false;

//a currently empty array of blocks which will later hold a list of all the walls
var blocks = [];

//a currently empty array for the items inn the background
var bkgrdBlocks = [];

//an array of the different types of enemies
var enemy = [];

//an array for all the coins
var coins = [];

//an array for all the pipes
var pipes = [];

//an array for all moving platforms
var platform = [];

//current level
var levelNum = 0;

//for underground parts of a level or things like
var lvlStage = 0;

//used to set up at the beginning of a level
var first = true;

//where the flag is (starts out way far, so that if you don't define it, you can't finish!)
var endX = 10000000;

//whether or not the player has crossed the flag
var endLevel = false;

//whether or not the player is going between tubes
var pipeMov = [false, 0, 0, 0, 0, 0, false];

//where you translate it
var translatePos = 0;

//the score you currently have (high score purposes)
var score = 0;

var highscore = 0;

//the score when you finished a level or something
var savedScore = 0;

//text version of the score (to be displayed)
var scoreText;

//the time until you automatically die
var timeLeft = 400;

//text version
var timeLeftText;

//how many coins you have
var coin = 0;

//when after player dies, this is run once!
var playerReset = false;

//how many lives mario has remaining
var lives = 3;

//how many consecutive jumps that are earned
var enemyCount = 0;

//how much the flag has come down
var flagY = 0;

//variable for when you click keys
var keys = [];

//a variable for only the first frame that you click
var firstClick = [];

//an array of all the items that are bouning up from question blocks
var qAnimation = [];

//array for the animation (or still sprite) of a goomba after it dies
var deadGoomba = [];

//a timer for mario's movements
var timer = 0;

//an array to store the different points text values on the screen
var points = [];

//an array to store the block debris as it falls of the screen
var debris = [];

}

//a function for drawing the different enemies
var enemyDraw = function(x, y, enemy, flip, type) {
    
    pushMatrix();
    
    if (flip) { //normal flipped enemy
        
        translate(x + 25, y); //translates 25 farther to right
        scale(-25/16, 25/16); //x flips, scales to 25 by 25
        
    } else {
        
        if (enemy === 0 & type === 2) { //upside down goomba
            
            translate(x, y + 25); //normal x y position
            scale(25/16, -25/16); //scales to 25 by 25
            
        } else { //normal enemy, not flipped
            
            translate(x, y); //normal x y position
            scale(25/16); //scales to 25 by 25
            
        }
        
    }
    
    noStroke ();
    
    if (enemy === 0) { //draws a goomba
        
        var color1 = color (156, 74, 0);
        var color2 = color (255, 206, 198);
        var color3 = color (0, 0, 0);
        
        if (type === 0 | type === 2) {
            
            fill (color1);
            for (var x = 0; x < 6; x ++) {
                
                rect (6 - x, x, 4 + 2 * x, 1);
                
            }
            rect (1, 6, 14, 5);
            rect (0, 7, 16, 3);
            
            fill (color2);
            rect (5, 10, 6, 1);
            rect (4, 11, 8, 4);
            rect (4, 5, 2, 4);
            rect (6, 7, 1, 2);
            rect (9, 7, 1, 2);
            rect (10, 5, 2, 4);
            
            fill (color3);
            rect (3, 4, 2, 1);
            rect (5, 5, 1, 3);
            rect (5, 6, 6, 1);
            rect (10, 5, 1, 3);
            rect (11, 4, 2, 1);
            rect (3, 13, 2, 2);
            rect (4, 14, 2, 2);
            rect (6, 15, 1, 1);
            rect (9, 14, 5, 2);
            rect (10, 13, 5, 2);
            rect (12, 12, 2, 1);
            
        } else if (type === 1) {
            
            fill (color1);
            rect (0, 11, 16, 2);
            rect (1, 10, 14, 1);
            rect (3, 9, 10, 1);
            rect (6, 8, 4, 1);
            
            fill (color2);
            rect (2, 11, 12, 1);
            rect (3, 13, 10, 1);
            rect (4, 14, 8, 1);
            
            fill (color3);
            rect (3, 10, 3, 1);
            rect (6, 11, 4, 1);
            rect (10, 10, 3, 1);
            rect (1, 15, 5, 1);
            rect (10, 15, 5, 1);
            
        }
        
    } else if (enemy === 1) {
        
        if (type === 0) {
            
            var color1 = color (30, 132, 0);
            var color2 = color (215, 141, 34);
            var color3 = color (255, 255, 255);
            
            translate(0, -8);
            
            fill (color1);
            rect (1, 7, 1, 1);
            rect (3, 3, 1, 3);
            rect (5, 12, 10, 9);
            rect (7, 10, 7, 2);
            rect (8, 9, 5, 1);
            
            fill (color2);
            for (var x = 5; x < 13; x += 1) {
                
                rect (x, 22 - x, 1, 1);
                
            }
            for (var x = 6; x < 12; x += 1) {
                
                rect (17 - x, 25 - x, 1, 1);
                
            }
            for (var x = 8; x < 15; x += 1) {
                
                rect (x, x + 2, 1, 1);
                
            }
            for (var x = 8; x < 15; x += 1) {
                
                rect (22 - x, x + 6, 1, 1);
                
            }
            rect (2, 2, 1, 2);
            rect (1, 4, 2, 3);
            rect (0, 7, 1, 4);
            rect (1, 8, 2, 2);
            rect (1, 10, 1, 1);
            rect (2, 7, 2, 1);
            rect (3, 8, 4, 1);
            rect (5, 7, 2, 3);
            rect (6, 3, 1, 4);
            rect (5, 7, 1, 5);
            rect (4, 11, 1, 4);
            rect (3, 12, 1, 6);
            rect (2, 13, 1, 2);
            rect (1, 13, 1, 1);
            rect (4, 20, 1, 2);
            rect (5, 21, 2, 2);
            rect (6, 22, 2, 2);
            rect (8, 23, 1, 1);
            rect (14, 20, 1, 1);
            rect (12, 21, 3, 2);
            rect (11, 23, 3, 1);
            
            fill (color3);
            rect (3, 1, 3, 2);
            rect (4, 0, 1, 8);
            rect (5, 1, 1, 6);
            rect (3, 6, 1, 1);
            rect (6, 10, 1, 2);
            rect (5, 12, 1, 4);
            rect (4, 15, 1, 5);
            rect (5, 19, 1, 1);
            rect (5, 20, 3, 1);
            rect (7, 21, 5, 1);
            rect (11, 20, 3, 1);
            rect (13, 19, 3, 1);
            rect (12, 12, 2, 1);
            rect (13, 12, 1, 2);
            
        } else if (type === 1) {
            
            translate(0, -8);
            
            fill (30, 132, 0);
            rect (1, 9, 1, 1);
            rect (2, 4, 1, 3);
            rect (5, 13, 10, 8);
            rect (5, 13, 9, 9);
            rect (7, 11, 7, 3);
            rect (8, 10, 5, 2);
            
            fill (215, 141, 34);
            for (var x = 5; x < 13; x ++) {
                
                rect (x, 23 - x, 1, 1);
                
            }
            for (var x = 6; x < 12; x ++) {
                
                rect (17 - x, 26 - x, 1, 1);
                
            }
            for (var x = 8; x < 15; x ++) {
                
                rect (x, x + 3, 1, 1);
                
            }
            for (var x = 8; x < 15; x ++) {
                
                rect (22 - x, x + 7 , 1, 1);
                
            }
            rect (1, 4, 1, 5);
            rect (0, 8, 3, 1);
            rect (0, 8, 1, 6);
            rect (2, 8, 1, 4);
            rect (0, 10, 3, 2);
            rect (0, 10, 2, 4);
            rect (1, 10, 1, 5);
            rect (2, 9, 4, 2);
            rect (4, 4, 3, 6);
            rect (4, 8, 2, 5);
            rect (3, 13, 2, 6);
            rect (2, 16, 2, 1);
            rect (5, 3, 1, 2);
            rect (3, 21, 4, 2);
            rect (2, 22, 4, 2);
            rect (1, 23, 2, 1);
            rect (11, 22, 3, 2);
            rect (11, 23, 4, 1);
            
            fill (252, 252, 252);
            rect (2, 2, 3, 2);
            rect (3, 1, 1, 8);
            rect (3, 2, 2, 6);
            rect (2, 7, 2, 1);
            rect (5, 13, 1, 4);
            rect (4, 16, 1, 5);
            rect (5, 20, 1, 2);
            rect (6, 21, 2, 1);
            rect (7, 22, 5, 1);
            rect (11, 21, 3, 1);
            rect (13, 20, 3, 1);
            rect (12, 13, 2, 1);
            rect (13, 13, 1, 2);
            
        } else if (type === 2) {
            
            fill (30, 132, 0);
            rect (5, 1, 6, 12);
            rect (4, 2, 8, 9);
            rect (3, 3, 10, 7);
            rect (2, 5, 12, 4);
            rect (1, 7, 14, 2);
            
            fill (215, 141, 34);
            rect (1, 7, 1, 1);
            rect (2, 6, 1, 1);
            rect (3, 5, 1, 1);
            rect (4, 4, 1, 1);
            rect (5, 3, 1, 1);
            rect (6, 2, 4, 1);
            rect (5, 1, 1, 1);
            rect (4, 6, 1, 1);
            rect (5, 7, 1, 1);
            rect (6, 8, 4, 1);
            rect (5, 9, 1, 1);
            rect (4, 10, 1, 1);
            rect (10, 3, 1, 1);
            rect (10, 1, 1, 1);
            rect (11, 4, 1, 1);
            rect (12, 5, 1, 1);
            rect (13, 6, 1, 1);
            rect (14, 7, 1, 1);
            rect (11, 6, 1, 1);
            rect (10, 7, 1, 1);
            rect (10, 9, 1, 1);
            rect (11, 10, 1, 1);
            
            fill (252, 252, 252);
            rect (0, 9, 3, 2);
            
            rect (3, 10, 1, 2);
            rect (4, 11, 1, 2);
            rect (5, 12, 1, 2);
            rect (6, 13, 4, 2);
            rect (10, 12, 1, 2);
            rect (11, 11, 1, 2);
            rect (12, 10, 1, 2);
            rect (13, 9, 3, 2);
            
        }
        
    }
    
    popMatrix();
    
};

//stored images for all of the pipes
var pipeImage = [];

//text font for when you score points!
var pointsText = function (x, y, message) {
    
    //setup
    pushMatrix ();
    noStroke();
    translate (x, y);
    scale (25 / 16);
    
    for (var a = 0; a < message.length; a ++) {//actual letters
        
        var type = message.charAt(a);
        
        fill (255, 206, 198);
        if (type === "0") { //0
            rect (1, 1, 1, 6);
            rect (2, 0, 1, 1);
            rect (3, 1, 1, 6);
            rect (2, 6, 1, 2);
            rect (1, 6, 3, 1);
        }
        if (type === "1") { //1
            rect (1, 1, 2, 1);
            rect (2, 0, 1, 8);
            rect (1, 6, 3, 2);
        }
        if (type === "2") { //2
            rect (0, 1, 1, 1);
            rect (1, 0, 2, 1);
            rect (3, 1, 1, 2);
            rect (2, 3, 1, 1);
            rect (1, 4, 1, 1);
            rect (0, 5, 1, 1);
            rect (0, 6, 4, 2);
        }
        if (type === "3") { // 1 UP
            rect (0, 1, 2, 1);
            rect (1, 0, 2, 7);
            rect (0, 6, 4, 1);
            
            rect (5, 0, 2, 6);
            rect (6, 5, 3, 2);
            rect (9, 0, 1, 6);
            rect (8, 5, 2, 1);
            
            rect (11, 0, 2, 7);
            rect (12, 0, 3, 1);
            rect (15, 1, 1, 3);
            rect (12, 4, 3, 1);
        }
        if (type === "4") { //4
            rect (0, 0, 1, 6);
            rect (2, 0, 1, 8);
            rect (0, 4, 4, 2);
        }
        if (type === "5") {
            rect (0, 0, 4, 1);
            rect (0, 0, 1, 4);
            rect (0, 3, 3, 1);
            rect (3, 4, 1, 3);
            rect (0, 6, 3, 2);
            rect (2, 6, 2, 1);
        }
        if (type === "8") {
            rect (0, 1, 1, 1);
            rect (1, 0, 2, 1);
            rect (3, 1, 1, 2);
            rect (1, 2, 1, 2);
            rect (2, 3, 1, 2);
            rect (3, 4, 1, 3);
            rect (0, 4, 1, 3);
            rect (1, 7, 2, 1);
            rect (1, 3, 2, 1);
            rect (2, 4, 2, 1);
        }
        
        translate(4, 0);
        
    }
    
    popMatrix();
    
};
//drawings for all the pipe images!
{

pushMatrix();

noStroke ();
scale(25/16);

//vertical pipe top

background(0, 0, 0, 0);

fill (0, 0, 0);
rect (0, 0, 32, 1);
rect (0, 0, 1, 15);
rect (31, 0, 1, 15);
rect (0, 14, 32, 1);
rect (2, 15, 28, 1);

fill (140, 214, 0);//light green
rect (1, 1, 30, 13);

fill (16, 148, 0);//dark green
rect (1, 2, 5, 1);
rect (4, 2, 2, 12);
rect (12, 2, 19, 1);
rect (12, 2, 1, 12);
rect (15, 2, 10, 12);

for (var b = 25; b < 29; b += 2) {//grid of dark green squares

    for (var a = 2; a < 14; a += 2) {
    
        rect (b, a, 1, 1);
    
    }
    
}
    
for (var b = 26; b < 29; b += 2) {
        
    for (var a = 3; a < 15; a += 2) {
            
    rect (b, a, 1, 1);
        
    }
    
}
pipeImage.push(get(0, 0, 50, 25));

//vertical pipe bottom

background(0, 0, 0, 0);

fill (0, 0, 0);
rect (2, 0, 1, 16);
rect (29, 0, 1, 16);

fill (140, 214, 0);//light green
rect (3, 0, 26, 16);

fill (16, 148, 0);//dark green
rect (6, 0, 2, 16);
rect (13, 0, 1, 16);
rect (16, 0, 8, 16);

for (var b = 24; b < 28; b += 2) {//grid of dark green squares

    for (var a = 1; a < 16; a += 2) {
        
        rect (b, a, 1, 1);
        
    }
    
}

for (var a = 0; a < 16; a += 2) {
    
    rect (25, a, 1, 1);
    
}
pipeImage.push(get(0, 0, 50, 25));

//horizontal pipe top

background(0, 0, 0, 0);

fill (0, 0, 0);
rect (0, 0, 14, 1);
rect (0, 0, 1, 32);
rect (0, 31, 14, 1);
rect (14, 0, 1, 32);
rect (15, 1, 1, 30);

fill (140, 214, 0);//light green
rect (1, 1, 13, 30);

fill (16, 148, 0);//dark green
rect (1, 5, 13, 2);
rect (1, 12, 13, 1);
rect (1, 17, 13, 9);

for (var b = 26; b < 29; b += 2) {//grid of dark green squares

    for (var a = 1; a < 15; a += 2) {
    
        rect (a, b, 1, 1);
    
    }

}

for (var a  = 2; a < 14; a += 2) {
    
    rect (a, 27, 1, 1);
    
}
pipeImage.push(get(0, 0, 25, 50));

//horizontal pipe bottom

background(0, 0, 0, 0);

fill (0, 0, 0);
rect (0, 1, 16, 1);
rect (0, 30, 16, 1);

fill (140, 214, 0);//light green
rect (0, 2, 16, 28);

fill (16, 148, 0);//dark green
rect (0, 6, 16, 2);
rect (0, 13, 16, 1);
rect (0, 16, 16, 9);

for (var b = 25; b < 29; b += 2) {//grid of dark green squares

    for (var a = 0; a < 15; a += 2) {
        
        rect (a, b, 1, 1);
        
    }
    
}

for (var a = 1; a < 16; a += 2) {
    
    rect (a, 26, 1, 1);
    
}
pipeImage.push(get(0, 0, 25, 50));

background(0, 0, 0, 0);

pushMatrix();

//draws another pipe horizontal
for (var i = 0; i < 2; i ++) { //accounts for a 50 by 50 square!
    
    translate(0, i*16); //moves down second time
    
    fill (0, 0, 0);
    rect (2, 0, 1, 16);
    rect (29, 0, 1, 16);
    
    fill (140, 214, 0);//light green
    rect (3, 0, 26, 16);
    
    fill (16, 148, 0);//dark green
    rect (6, 0, 2, 16);
    rect (13, 0, 1, 16);
    rect (16, 0, 8, 16);
    
    for (var b = 24; b < 28; b += 2) {//grid of dark green squares
    
        for (var a = 1; a < 16; a += 2) {
            
            rect (b, a, 1, 1);
            
        }
        
    }
    
    for (var a = 0; a < 16; a += 2) {
        
        rect (25, a, 1, 1);
        
    }
    
}

popMatrix();

fill (140, 214, 0);//light green
rect (2, 0, 14, 32);
rect (0, 2, 2, 28);

fill (16, 148, 0);//dark green
rect (6, 0, 2, 32);
rect (13, 0, 1, 32);
rect (0, 6, 6, 2);
rect (0, 13, 6, 1);
rect (0, 16, 6, 9);

for (var b = 25; b < 29; b += 2) {//grid of dark green squares

    for (var a = 0; a < 6; a += 2) {
        
        rect (a, b, 1, 1);
        
    }
    
}

for (var a = 1; a < 6; a += 2) {
    
    rect (a, 26, 1, 1);
    
}

fill (0, 0, 0);
rect (2, 0, 1, 1);
rect (0, 1, 4, 1);
rect (4, 2, 1, 3);
rect (5, 5, 1, 5);
rect (6, 10, 1, 12);
rect (5, 22, 1, 5);
rect (4, 27, 1, 3);
rect (2, 31, 1, 1);
rect (0, 30, 4, 1);

pipeImage.push(get(0, 0, 50, 50));

popMatrix();

}

//DEALS WITH ALL THE IMAGE STORING

{

/**

KEY

bkgrdImage - All the background images
blockImage - the different blocks
    0 - ground block
    1 - stair block
    2 - question blocks (array -> 3 stages and empty)
    3 - brick
    4 - top brick
    5 - left mushroom platform
    6 - middle mushroom platform
    7 - right mushroom platform
    8 - castle blocks
powerImage - the different powerups
    0 - coin (array -> 4 arrays or different worlds -> 3 stages)
    1 - 4 stages of bouncing coin
    2 - mushroom
    3 - fireflower
    4 - star
    5 - one up
    6 - block debris (not implemented!)
marioImage - different mario sprits
    0 - small mario
        normal
        star powerup
    1 - big mario
        normal
        star powerup
        fireflower
txtImage - all the text
    0 - normal text
    1 - text popping up
extra - flashing coin icon at top, mushroom selector at title screen
    0 to 2 - flashing coin
    3 - mushroom selector
titleImage - image of the title screen big sprite
    
*/

noStroke ();

//all the background images (i'll trust brandon on this one)
var bkgrdImage = []; 
//ground block, stair block, question blocks, brick, top brick, left mushroom platform, middle mushroom platform, right mushroom platform, castle brick, bridge, lava
var blockImage = [[], [], [[], [], [], []], [], [], [], [], [], [], [], []]; 
//coin, bouncing coin, mushroom, fireflower, star, one up, block debris
var powerImage = [[[], [], [], []], [], [], [], [], [], []]; //block debris
//small mario -> normal, star (its own array)
//big mario   -> normal, fireflower, star (its own array)
var marioImage = [[[]], [[]]]; //fireflower and star
//normal text, the text that appears when you score
var txtImage = [[], []]; //score text
//the flashing icon coin, the mushroom selector
var extra = [];
//the title screen
var titleImage;

noStroke ();
pushMatrix ();
scale (25 / 16);

var i;

for (i = 0; i < 23; i ++) {

    background (0, 0, 0, 0);
        
    if (i === 0) {
    
        fill (140, 214, 0);
        rect (9, 13, 7, 3);
        rect (11, 10, 5, 4);
        rect (13, 9, 3, 2);
        
        fill (0, 0, 0);
        rect (8, 13, 1, 2);
        rect (9, 15, 1, 1);
        rect (9, 12, 2, 1);
        rect (11, 10, 1, 1);
        rect (12, 9, 1, 1);
        rect (13, 8, 3, 1);
    
    }
        
    if (i === 1) {
    
        fill (140, 214, 0);
        rect (0, 7, 15, 9);
        rect (15, 8, 1, 8);
        rect (2, 3, 10, 4);
        rect (5, 1, 6, 3);
        rect (11, 4, 4, 4);
        rect (14, 8, 3, 8);
        
        fill (0, 0, 0);
        rect (0, 7, 1, 1);
        rect (1, 6, 1, 1);
        rect (2, 3, 1, 3);
        rect (3, 2, 2, 1);
        rect (5, 1, 1, 1);
        rect (6, 0, 4, 1);
        rect (10, 1, 1, 1);
        rect (11, 2, 1, 2);
        rect (12, 4, 1, 1);
        rect (13, 3, 1, 1);
        rect (14, 4, 1, 1);
        rect (15, 5, 1, 3);
        
        fill (16, 148, 0);
        rect (4, 7, 1, 1);
        rect (5, 6, 2, 1);
        rect (9, 5, 1, 1);
        rect (10, 6, 1, 1);
    
    }
        
    if (i === 2) {
    
        fill (140, 214, 0);
        rect (0, 10, 5, 6);
        rect (3, 9, 1, 1);
        rect (5, 12, 2, 4);
        rect (0, 13, 6, 3);
        
        fill (0, 0, 0);
        rect (0, 8, 1, 2);
        rect (1, 10, 1, 1);
        rect (2, 9, 1, 1);
        rect (3, 8, 1, 1);
        rect (4, 9, 1, 3);
        rect (5, 12, 1, 1);
        rect (6, 11, 1, 1);
        rect (7, 12, 1, 3);
        rect (6, 15, 1, 1);
    
    }
        
    if (i === 3) {
    
        fill (255, 255, 255);
        rect (9, 13, 7, 3);
        rect (11, 10, 5, 4);
        rect (13, 9, 3, 2);
        
        fill (0, 0, 0);
        rect (8, 13, 1, 2);
        rect (9, 15, 1, 1);
        rect (9, 12, 2, 1);
        rect (11, 10, 1, 1);
        rect (12, 9, 1, 1);
        rect (13, 8, 3, 1);
    
    }
        
    if (i === 4) {
    
        fill (255, 255, 255);
        rect (0, 7, 15, 9);
        rect (15, 8, 1, 8);
        rect (2, 3, 10, 4);
        rect (5, 1, 6, 3);
        rect (11, 4, 4, 4);
        rect (14, 8, 3, 8);
        
        fill (0, 0, 0);
        rect (0, 7, 1, 1);
        rect (1, 6, 1, 1);
        rect (2, 3, 1, 3);
        rect (3, 2, 2, 1);
        rect (5, 1, 1, 1);
        rect (6, 0, 4, 1);
        rect (10, 1, 1, 1);
        rect (11, 2, 1, 2);
        rect (12, 4, 1, 1);
        rect (13, 3, 1, 1);
        rect (14, 4, 1, 1);
        rect (15, 5, 1, 3);
        
        fill (99, 173, 255);
        rect (4, 7, 1, 1);
        rect (5, 6, 2, 1);
        rect (9, 5, 1, 1);
        rect (10, 6, 1, 1);
    
    }
        
    if (i === 5) {
    
        fill (255, 255, 255);
        rect (0, 10, 5, 6);
        rect (3, 9, 1, 1);
        rect (5, 12, 2, 4);
        rect (0, 13, 6, 3);
        
        fill (0, 0, 0);
        rect (0, 8, 1, 2);
        rect (1, 10, 1, 1);
        rect (2, 9, 1, 1);
        rect (3, 8, 1, 1);
        rect (4, 9, 1, 3);
        rect (5, 12, 1, 1);
        rect (6, 11, 1, 1);
        rect (7, 12, 1, 3);
        rect (6, 15, 1, 1);
    
    }
        
    if (i === 6) {
    
        fill (255, 255, 255);
        rect (11, 0, 5, 2);
        rect (13, 0, 3, 4);
        
        fill (0, 0, 0);
        rect (10, 0, 1, 1);
        rect (11, 1, 1, 1);
        rect (12, 2, 1, 2);
        rect (13, 4, 3, 1);
        
        fill (99, 173, 255);
        rect (13, 0, 1, 1);
        rect (14, 1, 1, 1);
        rect (15, 2, 1, 1);
    
    }
        
    if (i === 7) {
    
        fill (255, 255, 255);
        rect (0, 0, 16, 6);
        rect (3, 5, 3, 2);
        rect (10, 5, 4, 2);
        
        fill (0, 0, 0);
        rect (0, 5, 1, 1);
        rect (1, 6, 2, 1);
        rect (3, 7, 3, 1);
        rect (6, 6, 1, 1);
        rect (7, 5, 1, 1);
        rect (8, 6, 2, 1);
        rect (10, 7, 4, 1);
        rect (14, 6, 2, 1);
        
        fill (99, 173, 255);
        rect (0, 2, 3, 1);
        rect (1, 1, 1, 1);
        rect (2, 3, 6, 1);
        rect (4, 4, 2, 1);
        rect (6, 2, 4, 1);
        rect (8, 1, 1, 1);
        rect (9, 0, 1, 1);
        rect (9, 3, 5, 1);
        rect (10, 4, 3, 1);
        rect (14, 2, 1, 1);
    
    }
        
    if (i === 8) {
    
        fill (255, 255, 255);
        rect (0, 0, 5, 6);
        rect (0, 0, 6, 5);
        rect (5, 1, 2, 3);
        
        fill (0, 0, 0);
        rect (0, 5, 1, 1);
        rect (1, 6, 2, 1);
        rect (3, 5, 2, 1);
        rect (5, 4, 2, 1);
        rect (5, 0, 1, 1);
        rect (6, 1, 1, 1);
        rect (7, 2, 1, 1);
    
    }
        
    if (i === 9) {
    
        for (var a = 0; a < 16; a ++) {
        
            fill (0, 173, 0);
            rect (a, 15 - a, 16 - a, 15 - a);
            
            fill (0, 0, 0);
            rect (a, 15 - a, 1, 1);
        
        }
    
    }
        
    if (i === 10) {
    
        for (var a = 0; a < 16; a ++) {
        
            fill (0, 173, 0);
            rect (0, a, a, 16 - a);
            
            fill (0, 0, 0);
            rect (a, a, 1, 1);
        
        }
    
    }
        
    if (i === 11) {
    
        fill (0, 173, 0);
        rect (0, 0, 16, 16);
    
    }
        
    if (i === 12) {
    
        fill (0, 173, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (9, 4, 2, 4);
        rect (12, 1, 3, 4);
        rect (13, 0, 1, 6);
    
    }
        
    if (i === 13) {
    
        fill (0, 173, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (4, 1, 3, 4);
        rect (5, 0, 1, 6);
        rect (1, 4, 2, 4);
    
    }
        
    if (i === 14) {
    
        fill (0, 173, 0);
        rect (2, 14, 12, 2);
        
        fill (0, 0, 0);
        rect (0, 15, 2, 1);
        rect (2, 14, 3, 1);
        rect (5, 13, 6, 1);
        rect (11, 14, 3, 1);
        rect (14, 15, 2, 1);
    
    }
        
    if (i === 15) {
    
        fill (156, 74, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (0, 3, 16, 1);
        rect (0, 7, 16, 1);
        rect (0, 11, 16, 1);
        rect (0, 15, 16, 1);
        rect (7, 0, 1, 3);
        rect (15, 0, 1, 3);
        rect (3, 4, 1, 3);
        rect (11, 4, 1, 3);
        rect (7, 8, 1, 3);
        rect (15, 8, 1, 3);
        rect (3, 12, 1, 3);
        rect (11, 12, 1, 3);
    
    }
        
    if (i === 16) {
    
        fill (156, 74, 0);
        rect (0, 0, 3, 16);
        rect (3, 8, 9, 8);
        rect (12, 0, 4, 16);
        
        fill (0, 0, 0);
        rect (0, 7, 16, 1);
        rect (0, 11, 16, 1);
        rect (0, 15, 16, 1);
        rect (7, 8, 1, 3);
        rect (15, 8, 1, 3);
        rect (3, 12, 1, 3);
        rect (11, 12, 1, 3);
        
        fill (255, 206, 198);
        rect (0, 0, 4, 1);
        rect (3, 0, 1, 8);
        rect (3, 7, 9, 1);
        rect (11, 0, 1, 8);
        rect (11, 0, 5, 1);
    
    }
        
    if (i === 17) {
    
        fill (156, 74, 0);
        rect (0, 0, 3, 16);
        rect (3, 8, 9, 8);
        rect (12, 0, 4, 16);
        rect (3, 0, 8, 8);
        
        fill (0, 0, 0);
        rect (0, 7, 16, 1);
        rect (0, 11, 16, 1);
        rect (0, 15, 16, 1);
        rect (7, 8, 1, 3);
        rect (15, 8, 1, 3);
        rect (3, 12, 1, 3);
        rect (11, 12, 1, 3);
        rect (4, 3, 7, 1);
        rect (7, 0, 1, 3);
        
        fill (255, 206, 198);
        rect (0, 0, 4, 1);
        rect (3, 0, 1, 8);
        rect (3, 7, 9, 1);
        rect (11, 0, 1, 8);
        rect (11, 0, 5, 1);
    
    }
        
    if (i === 18) {
    
        fill (156, 74, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (8, 0, 8, 16);
        rect (7, 0, 2, 4);
        rect (7, 7, 2, 5);
        rect (0, 3, 8, 1);
        rect (0, 7, 7, 1);
        rect (0, 11, 7, 1);
        rect (0, 15, 8, 1);
        rect (3, 3, 1, 5);
        rect (3, 12, 1, 4);
    
    }
        
    if (i === 19) {
    
        fill (156, 74, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (0, 0, 8, 16);
        rect (8, 3, 8, 1);
        rect (8, 7, 8, 1);
        rect (8, 11, 8, 1);
        rect (8, 15, 8, 1);
        rect (15, 0, 1, 3);
        rect (15, 8, 1, 3);
        rect (11, 4, 1, 3);
        rect (11, 12, 1, 3);
    
    }
        
    if (i === 20) {
    
        fill (156, 74, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (0, 6, 16, 10);
        rect (1, 3, 14, 4);
        rect (0, 3, 16, 1);
        rect (2, 2, 12, 1);
        rect (3, 1, 10, 2);
        rect (5, 0, 6, 2);
        rect (15, 0, 1, 4);
    
    }
        
    if (i === 21) {
    
        fill (0, 0, 0);
        rect (0, 0, 16, 16);
    
    }
        
    if (i === 22) {
    
        fill (156, 74, 0);
        rect (0, 0, 16, 16);
        
        fill (0, 0, 0);
        rect (3, 4, 1, 3);
        rect (4, 1, 1, 3);
        rect (3, 12, 1, 3);
        rect (4, 9, 1, 3);
        rect (11, 4, 1, 3);
        rect (12, 1, 1, 3);
        rect (11, 12, 1, 3);
        rect (12, 9, 1, 3);
    
    }
    
    bkgrdImage.push (get (0, 0, 25, 25));

}//Background

for (i = 0; i < 2; i ++) {
    
    var color1 = color (156, 74, 0);
    var color2 = color (255, 206, 198);
    
    if (i === 1) {
        
        color1 = color (38, 123, 139);
        color2 = color (187, 239, 238);
    
    }
    
    background (0, 0, 0, 0);//1 and 5
    
    fill (color1);
    rect (0, 0, 16, 16);
    
    fill (color2);
    rect (1, 0, 8, 1);
    rect (0, 1, 1, 14);
    rect (1, 11, 1, 1);
    rect (2, 12, 2, 1);
    rect (4, 13, 3, 1);
    rect (11, 0, 4, 1);
    rect (10, 1, 1, 4);
    rect (10, 6, 1, 4);
    rect (10, 6, 5, 1);
    rect (9, 10, 1, 2);
    rect (8, 12, 1, 4);
    
    fill (0, 0, 0);
    rect (9, 0, 1, 10);
    rect (8, 10, 1, 2);
    rect (0, 10, 2, 1);
    rect (2, 11, 2, 1);
    rect (4, 12, 4, 1);
    rect (7, 12, 1, 3);
    rect (1, 15, 6, 1);
    rect (9, 15, 6, 1);
    rect (15, 1, 1, 4);
    rect (11, 4, 1, 2);
    rect (11, 5, 4, 1);
    rect (15, 6, 1, 9);
    rect (14, 14, 1, 1);
    
    blockImage[0].push (get (0, 0, 25, 25));
    
    background (0, 0, 0, 0);//2 and 6
    
    fill (color1);
    rect (0, 0, 16, 16);
    
    for (var j = 0; j < 4; j ++) {
        
        fill (color2);
        rect (j + 1, 0, 14 - j * 2, j + 1);
        rect (0, j + 1, j + 1, 14 - j * 2);
        
        fill (0, 0, 0);
        rect (j + 1, 15 - j, 14 - j * 2, j + 1);
        rect (12 + j, 4 - j, 4 - j, j * 2 + 8);
        
    }
    
    blockImage[1].push (get (0, 0, 25, 25));
    
    background (0, 0, 0, 0);//3 and 7
    
    fill (color1);
    rect (0, 0, 16, 16);
    
    fill (0, 0, 0);
    rect (0, 3, 16, 1);
    rect (0, 7, 16, 1);
    rect (0, 11, 16, 1);
    rect (0, 15, 16, 1);
    rect (7, 0, 1, 3);
    rect (15, 0, 1, 3);
    rect (3, 4, 1, 3);
    rect (11, 4, 1, 3);
    rect (7, 8, 1, 3);
    rect (15, 8, 1, 3);
    rect (3, 12, 1, 3);
    rect (11, 12, 1, 3);
    
    fill (color2);
    rect (0, 0, 16, 1);
    
    blockImage[3].push (get (0, 0, 25, 25));
    
    background (0, 0, 0, 0);//4 and 8
    
    fill (color1);
    rect (0, 0, 16, 16);
    
    fill (0, 0, 0);
    rect (0, 3, 16, 1);
    rect (0, 7, 16, 1);
    rect (0, 11, 16, 1);
    rect (0, 15, 16, 1);
    rect (7, 0, 1, 3);
    rect (15, 0, 1, 3);
    rect (3, 4, 1, 3);
    rect (11, 4, 1, 3);
    rect (7, 8, 1, 3);
    rect (15, 8, 1, 3);
    rect (3, 12, 1, 3);
    rect (11, 12, 1, 3);
    
    blockImage[4].push (get (0, 0, 25, 25));

}//Blocks

for (i = 0; i < 2; i ++) {
    
    var color1 = color (140, 214, 0);
    var color2 = color (16, 148, 0);
    
    if (i === 1) {
        
        color1 = color (224, 158, 42);
        color2 = color (174, 47, 40);
        
    }
    
    background (0, 0, 0, 0);//9 and 12
    
    fill (color1);
    rect (1, 1, 15, 13);
    rect (1, 1, 6, 14);
    rect (8, 1, 7, 14);
    
    fill (0, 0, 0);
    rect (2, 0, 14, 1);
    rect (2, 0, 1, 2);
    rect (1, 1, 2, 1);
    rect (1, 1, 1, 3);
    rect (0, 3, 2, 1);
    rect (0, 3, 1, 11);
    rect (1, 14, 1, 1);
    rect (2, 15, 4, 1);
    rect (6, 14, 1, 1);
    rect (7, 13, 1, 1);
    rect (8, 14, 1, 1);
    rect (9, 15, 5, 1);
    rect (14, 14, 1, 1);
    rect (15, 13, 1, 1);
    
    blockImage[5].push (get (0, 0, 25, 25));
    
    background (0, 0, 0, 0);//10 and 13
    
    fill (color2);
    rect (0, 14, 16, 2);
    
    fill (color1);
    rect (0, 0, 16, 14);
    rect (0, 0, 7, 15);
    rect (8, 0, 7, 15);
    
    fill (0, 0, 0);
    rect (0, 0, 16, 1);
    rect (0, 14, 1, 1);
    rect (1, 15, 5, 1);
    rect (6, 14, 1, 1);
    rect (7, 13, 1, 1);
    rect (8, 14, 1, 1);
    rect (9, 15, 5, 1);
    rect (14, 14, 1, 1);
    rect (15, 13, 1, 1);
    
    blockImage[6].push (get (0, 0, 25, 25));
    
    background (0, 0, 0, 0);//11 and 14
    
    fill (color1);
    rect (0, 1, 14, 13);
    rect (0, 2, 15, 12);
    rect (1, 1, 6, 14);
    rect (9, 1, 5, 14);
    
    fill (0, 0, 0);
    rect (0, 0, 13, 1);
    rect (13, 1, 1, 1);
    rect (14, 2, 1, 2);
    rect (15, 4, 1, 10);
    rect (0, 14, 1, 1);
    rect (1, 15, 5, 1);
    rect (6, 14, 1, 1);
    rect (7, 13, 2, 1);
    rect (9, 14, 1, 1);
    rect (10, 15, 4, 1);
    rect (14, 14, 1, 1);
    
    blockImage[7].push (get (0, 0, 25, 25));
    
}//Mushrooms

for (i = 0; i < 4; i ++) {
    
    for (j = 0; j < 3; j ++) {
    
        var color1 = color (156, 74, 0);
        var color2 = color (231, 156, 33);
        var color3 = color (0, 0, 0);
        
        background (0, 0, 0, 0);
        
        if (i === 1) {
            
            color3 = color (38, 123, 139);
            
        }
        if (i === 2) {
        color3 = color (99, 99, 99);
        }
        if (i === 3) {
        color1 = color (66, 66, 255);
        }
        if (j === 1) {
        color2 = color (153, 78, 0);
        }
        if (j === 2) {
        color2 = color (86, 29, 0);
        }
        
        //question mark block
        fill (color2);
        rect (1, 1, 14, 14);
        
        fill (color3);
        rect (2, 2, 1, 1);
        rect (13, 2, 1, 1);
        rect (2, 13, 1, 1);
        rect (13, 13, 1, 1);
        rect (15, 1, 1, 15);
        rect (0, 15, 16, 1);
        rect (5, 4, 2, 4);
        rect (5, 4, 4, 1);
        rect (10, 5, 2, 4);
        rect (8, 8, 2, 3);
        rect (8, 12, 2, 2);
        
        fill (color1);
        rect (1, 0, 14, 1);
        rect (0, 1, 1, 14);
        rect (4, 4, 2, 3);
        rect (5, 3, 5, 1);
        rect (9, 4, 2, 4);
        rect (8, 7, 3, 1);
        rect (7, 8, 2, 2);
        rect (7, 11, 2, 2);
        
        blockImage[2][j].push (get (0, 0, 25, 25));
        
        background (0, 0, 0, 0);
        
        fill (color2); //main golden coin
        rect (3, 5, 8, 8);
        rect (4, 3, 6, 12);
        rect (5, 2, 4, 14);
        
        fill (color1); //brown coin shadow thing inside
        if (i === 3) {
            
            fill (252, 252, 252);
            
        }
        rect (6, 4, 2, 1);
        rect (5, 5, 1, 8);
        
        fill (color3); //black coin shadow thing
        rect (8, 5, 1, 8);
        rect (6, 13, 2, 1);
        rect (9, 2, 2, 1);
        rect (10, 3, 2, 2);
        rect (11, 5, 2, 8);
        rect (10, 13, 2, 2);
        rect (9, 15, 2, 1);
        rect (10, 2, 1, 2);
        rect (11, 3, 1, 11);
        rect (10, 14, 1, 2);
        
        powerImage[0][j].push (get (0, 0, 25, 25));
        
    }
    
    background (0, 0, 0, 0);
    
    fill (color1); //brown background
    rect (1, 1, 14, 14);
    
    fill (color3); //black outside and dots
    rect (1, 0, 14, 1);
    rect (0, 1, 1, 14);
    rect (1, 15, 14, 1);
    rect (15, 1, 1, 14);
    rect (2, 2, 1, 1);
    rect (2, 13, 1, 1);
    rect (13, 2, 1, 1);
    rect (13, 13, 1, 1);
    
    blockImage[2][3].push (get (0, 0, 25, 25));
    
}//Question Mark Blocks and Coins

for (i = 0; i < 6; i ++) {
    
    var color1 = color (25, 100, 50);
    var color2 = color (255, 255, 255);
    var color3 = color (227, 157, 37);
    
    background (0, 0, 0, 0);
    
    if (i !== 5) {
        
    var a = 0;
    
    if (i === 1 | i === 4) {
        
        a = 1;
        
    }
    
    translate (a, a);
    
    fill (color1);
    rect (3, 3, 10, 3);
    rect (4, 2, 6, 2);
    
    fill (color2);
    rect (5, 0, 5, 2);
    rect (4, 1, 9, 1);
    
    fill (color3);
    rect (4, 3, 1, 2);
    rect (5, 5, 3, 2);
    rect (7, 2, 2, 5);
    rect (6, 3, 2, 1);
    rect (8, 4, 2, 1);
    rect (8, 6, 4, 1);
    rect (10, 2, 1, 2);
    rect (10, 3, 3, 1);
    rect (11, 4, 3, 1);
    rect (11, 3, 2, 2);
    
    translate (- a, - a);
    
    }
    
    if (i === 0) {
        
        fill (color1);
        rect (4, 7, 6, 1);
        rect (3, 8, 10, 2);
        rect (2, 9, 12, 2);
        rect (3, 14, 3, 2);
        rect (2, 15, 2, 1);
        rect (10, 14, 3, 2);
        rect (12, 15, 2, 1);
    
        fill (color2);
        rect (4, 12, 3, 2);
        rect (9, 12, 3, 2);
        rect (5, 10, 6, 2);
        rect (6, 9, 4, 4);
        rect (6, 7, 1, 3);
        rect (9, 8, 1, 2);
    
        fill (color3);
        rect (2, 10, 2, 3);
        rect (4, 11, 1, 1);
        rect (6, 10, 1, 1);
        rect (9, 10, 1, 1);
        rect (11, 11, 1, 1);
        rect (12, 10, 2, 3);
        
    }
    if (i === 1) {
        
        fill (color1);
        rect (2, 13, 1, 2);
        rect (3, 11, 2, 3);
        rect (5, 8, 6, 3);
        rect (7, 14, 3, 2);
        rect (10, 15, 1, 1);
        rect (2, 13, 2, 1);
        
        fill (color2);
        rect (9, 8, 1, 1);
        rect (5, 10, 1, 2);
        rect (5, 11, 7, 2);
        rect (4, 12, 3, 2);
        rect (8, 12, 3, 2);
        
        fill (color3);
        rect (3, 10, 2, 1);
        rect (4, 9, 1, 1);
        rect (11, 9, 2, 2);
        rect (12, 8, 1, 2);
        rect (12, 9, 2, 1);
        
    }
    if (i === 2) {
        
        fill (color1);
        rect (4, 7, 6, 1);
        rect (3, 8, 8, 4);
        rect (5, 12, 4, 4);
        rect (8, 13, 3, 2);
        rect (10, 14, 2, 1);
        
        fill (color2);
        rect (6, 7, 1, 1);
        rect (7, 8, 2, 2);
        rect (6, 9, 2, 1);
        rect (10, 10, 2, 2);
        rect (7, 9, 4, 4);
        rect (5, 13, 3, 1);
        rect (4, 12, 1, 1);
        rect (3, 11, 1, 1);
        
        fill (color3);
        rect (6, 11, 2, 2);
        rect (8, 11, 1, 1);
        rect (8, 9, 1, 1);
        rect (11, 9, 1, 1);
        
    }
    if (i === 3) {
        
        fill (color1);
        rect (2, 7, 8, 2);
        rect (4, 8, 9, 2);
        rect (12, 11, 2, 3);
        rect (13, 10, 1, 2);
        rect (1, 13, 3, 2);
        rect (2, 15, 3, 1);
        rect (2, 14, 2, 2);
        
        fill (color2);
        rect (6, 7, 2, 1);
        rect (6, 8, 3, 5);
        rect (9, 9, 2, 5);
        rect (10, 11, 2, 3);
        rect (4, 10, 2, 3);
        rect (3, 11, 3, 3);
        rect (2, 12, 2, 1);
        rect (8, 9, 2, 4);
        
        fill (color3);
        rect (0, 8, 2, 3);
        rect (2, 9, 1, 1);
        rect (7, 9, 1, 1);
        rect (13, 8, 2, 2);
        rect (12, 8, 2, 1);
        
    }
    if (i === 4) {
        
        fill (color1);
        rect (13, 3, 3, 2);
        rect (13, 6, 2, 1);
        rect (15, 4, 1, 2);
        rect (13, 6, 1, 2);
        rect (2, 8, 11, 2);
        rect (1, 9, 12, 2);
        rect (4, 11, 12, 3);
        rect (15, 9, 1, 3);
        rect (3, 12, 1, 3);
        rect (2, 13, 2, 2);
        rect (1, 14, 1, 2);
        rect (4, 8, 3, 5);
        
        fill (color2);
        rect (7, 8, 1, 1);
        rect (11, 8, 1, 1);
        rect (8, 9, 1, 2);
        rect (12, 9, 1, 2);
        rect (8, 10, 5, 2);
        rect (7, 11, 7, 3);
        rect (4, 11, 2, 2);
        rect (5, 12, 6, 3);
        rect (4, 14, 4, 2);
        
        fill (color3);
        rect (13, 0, 3, 2);
        rect (14, 2, 2, 1);
        rect (0, 10, 2, 2);
        rect (1, 12, 1, 1);
        rect (2, 11, 1, 1);
        rect (9, 11, 1, 1);
        rect (12, 11, 1, 1);
        
    }
    if (i === 5) {
        
        fill (color1);
        rect (3, 2, 10, 4);
        rect (4, 6, 8, 3);
        rect (2, 9, 12, 4);
        rect (3, 12, 10, 2);
        
        fill (color2);
        rect (6, 0, 4, 2);
        rect (5, 1, 6, 1);
        rect (3, 8, 3, 1);
        rect (4, 8, 2, 2);
        rect (5, 10, 2, 4);
        rect (6, 11, 4, 3);
        rect (9, 10, 2, 4);
        rect (10, 8, 2, 2);
        rect (10, 8, 3, 1);
        
        fill (color3);
        rect (1, 2, 2, 3);
        rect (3, 1, 1, 2);
        rect (12, 1, 1, 2);
        rect (13, 2, 2, 3);
        rect (5, 2, 1, 2);
        rect (7, 2, 2, 4);
        rect (10, 2, 1, 2);
        rect (6, 4, 4, 1);
        rect (5, 6, 1, 2);
        rect (5, 7, 6, 1);
        rect (6, 7, 4, 2);
        rect (10, 6, 1, 2);
        rect (6, 11, 1, 1);
        rect (9, 11, 1, 1);
        rect (2, 2, 2, 1);
        rect (12, 2, 2, 1);
        
    }
    
    marioImage[0][0].push (get (0, 0, 25, 25));
    
}//Small Mario

for (i = 0; i < 5; i ++) {
    
    background (0, 0, 0, 0);
    
    var color1 = color (25, 100, 50);
    var color2 = color (255, 255, 255);
    var color3 = color (227, 157, 37);
    
    var a = 0;
    var b = 0;
    
    if (i === 1) {
        
        b = 2;
        a = 1;
        
    }
    if (i === 2) {
        
        b = 1;
        
    }
    if (i === 4) {
        
        b = 2;
        
    }
    
    pushMatrix ();
    translate (a, b);
    
    fill (color1);
    rect (4, 4, 8, 7);//hair and eyes
    rect (2, 5, 12, 5);
    if (i !== 4) {
        
        rect (1, 7, 2, 2);
        
    }
    rect (3, 4, 2, 1);
    if (i === 0 | i === 3) {
        
        rect (1, 7, 2, 3);
        
    }
    if (i === 0 | i === 2 | i === 3) {
        
        rect (3, 9, 1, 2);
        rect (3, 10, 2, 1);
        
    }
    
    fill (color2);
    rect (3, 3, 11, 1);//hat
    rect (3, 2, 8, 2);
    rect (4, 1, 7, 3);
    rect (6, 0, 5, 4);
    
    fill (color3);
    rect (3, 5, 2, 4);//ear
    rect (4, 8, 4, 2);//face
    rect (5, 9, 4, 2);
    rect (6, 4, 2, 2);
    rect (7, 4, 1, 6);
    rect (8, 6, 6, 1);
    rect (7, 6, 3, 2);
    rect (8, 10, 5, 1);
    rect (9, 4, 3, 1);
    rect (10, 4, 2, 2);
    rect (10, 5, 4, 2);//nose
    rect (11, 6, 4, 2);
    rect (9, 2, 2, 1);//yellow on hat
    rect (10, 1, 1, 2);
    
    popMatrix ();

    if (i === 0) {
        
        fill (color1);
        rect (4, 11, 7, 2);//arms and chest
        rect (4, 10, 1, 2);
        rect (4, 12, 8, 2);
        rect (3, 13, 10, 2);
        rect (2, 14, 12, 5);
        rect (1, 15, 14, 3);
        rect (0, 17, 16, 3);
        rect (0, 30, 6, 2);//left shoe
        rect (2, 28, 4, 4);
        rect (10, 30, 6, 2);//right shoe
        rect (10, 28, 4, 4);
        
        fill (color2);
        rect (5, 12, 1, 4);//overalls
        rect (4, 16, 2, 2);
        rect (4, 18, 8, 6);
        rect (10, 12, 1, 4);
        rect (10, 16, 2, 2);
        rect (3, 23, 10, 2);//pants
        rect (2, 24, 12, 1);
        rect (1, 25, 6, 1);
        rect (1, 25, 5, 3);
        rect (9, 25, 6, 1);
        rect (10, 25, 5, 3);
        rect (2, 24, 5, 2);
        rect (9, 24, 5, 2);
        
        fill (color3);
        rect (5, 10, 5, 2);//neck
        rect (0, 20, 4, 2);//left hand
        rect (1, 21, 3, 2);
        rect (1, 22, 2, 2);
        rect (12, 20, 4, 2);//right hand
        rect (12, 21, 3, 2);
        rect (13, 22, 2, 2);
        rect (5, 19, 1, 1);//buttons
        rect (10, 19, 1, 1);
        
    }
    if (i === 1) {
        
        fill (color1);
        rect (4, 13, 6, 14);//shirt
        rect (4, 13, 1, 2);
        rect (3, 14, 7, 13);
        rect (2, 15, 10, 3);
        rect (9, 14, 2, 2);
        rect (0, 24, 4, 5);//left shoe
        rect (0, 24, 2, 6);
        rect (0, 24, 1, 7);
        rect (3, 16, 10, 11);//more shirt
        rect (9, 26, 4, 6);//right shoe
        rect (9, 30, 6, 2);
        
        fill (color2);
        rect (5, 13, 3, 1);//overalls
        rect (4, 14, 1, 4);
        rect (3, 16, 2, 8);
        rect (4, 18, 2, 9);
        rect (5, 20, 2, 7);
        rect (6, 21, 3, 5);
        rect (6, 25, 2, 2);
        rect (8, 22, 3, 3);
        rect (8, 22, 4, 2);
        rect (8, 22, 5, 1);
        rect (12, 21, 1, 2);
        rect (8, 14, 1, 1);
        rect (9, 15, 1, 1);
        rect (10, 16, 2, 1);
        rect (9, 26, 4, 2);
        rect (11, 25, 2, 3);
        rect (12, 24, 2, 2);
        
        fill (color3);
        rect (8, 12, 3, 2);//hand
        rect (12, 16, 2, 3);
        rect (13, 17, 3, 4);
        
    }
    if (i === 2) {
        
        fill (color1);
        rect (3, 13, 8, 10);//shirt
        rect (2, 14, 9, 9);
        rect (4, 15, 8, 11);
        rect (11, 24, 2, 1);//top shoe
        rect (5, 25, 6, 3);
        rect (10, 27, 2, 2);
        rect (5, 27, 4, 4);//bottom shoe
        rect (4, 29, 2, 2);
        rect (6, 30, 5, 2);
        
        fill (color2);
        rect (4, 12, 4, 1);//overalls
        rect (4, 12, 1, 2);
        rect (7, 12, 1, 2);
        rect (7, 13, 2, 1);
        rect (8, 13, 1, 2);
        rect (8, 14, 2, 3);
        rect (9, 16, 2, 1);
        rect (3, 14, 1, 6);
        rect (2, 19, 2, 4);
        rect (3, 20, 2, 4);
        rect (4, 21, 2, 5);
        rect (4, 22, 3, 3);
        rect (4, 22, 4, 2);
        rect (5, 22, 1, 5);
        rect (5, 26, 2, 1);
        rect (6, 26, 1, 2);
        rect (6, 27, 3, 1);
        rect (10, 20, 4, 3);
        rect (11, 19, 2, 5);
        
        fill (color3);
        rect (8, 11, 2, 2);//hand
        rect (8, 18, 3, 4);
        rect (9, 17, 2, 3);
        rect (9, 18, 3, 3);
        
    }
    if (i === 3) {
        
        fill (color1);
        rect (5, 11, 5, 16);//shirt
        rect (3, 13, 9, 6);
        rect (2, 14, 12, 5);
        rect (13, 14, 2, 4);
        rect (14, 14, 2, 3);
        rect (1, 15, 2, 5);
        rect (0, 18, 9, 2);
        rect (0, 26, 6, 3);//left shoe
        rect (1, 26, 3, 5);
        rect (2, 31, 3, 1);
        rect (2, 30, 2, 2);
        rect (2, 25, 2, 2);
        rect (3, 24, 3, 2);
        rect (11, 23, 5, 5);//right shoe
        rect (14, 22, 2, 2);
        rect (15, 21, 1, 2);
        
        fill (color2);
        rect (4, 12, 4, 1);//overalls
        rect (7, 12, 1, 2);
        rect (7, 13, 2, 1);
        rect (8, 13, 1, 2);
        rect (8, 14, 2, 13);
        rect (8, 18, 3, 9);
        rect (10, 12, 1, 1);
        rect (11, 13, 1, 2);
        rect (4, 19, 9, 4);
        rect (12, 15, 1, 5);
        rect (7, 17, 2, 2);
        rect (6, 18, 2, 2);
        rect (4, 22, 6, 2);
        rect (5, 23, 5, 2);
        rect (6, 24, 4, 2);
        rect (3, 24, 1, 3);
        rect (3, 25, 2, 2);
        rect (4, 26, 2, 2);
        rect (5, 27, 1, 2);
        rect (5, 27, 3, 1);
        
        fill (color3);
        rect (8, 10, 2, 2);//left hand
        rect (0, 20, 5, 2);
        rect (0, 20, 4, 3);
        rect (1, 20, 3, 4);
        rect (13, 13, 3, 3);//right hand
        rect (14, 12, 1, 5);
        rect (12, 18, 1, 1);//buttons
        rect (9, 18, 1, 1);
        
    }
    if (i === 4) {
        
        fill (color1);
        rect (1, 10, 2, 2);//hair correction
        rect (3, 11, 2, 2);
        rect (11, 1, 5, 4);
        rect (14, 1, 2, 7);
        rect (12, 6, 3, 1);
        rect (15, 6, 1, 4);
        rect (14, 10, 1, 4);
        rect (13, 12, 2, 2);
        rect (13, 12, 1, 4);
        rect (4, 13, 10, 3);
        rect (1, 14, 12, 7);
        rect (0, 15, 2, 5);
        rect (0, 25, 2, 6);//left shoe
        rect (0, 25, 7, 5);
        rect (3, 24, 1, 2);
        rect (6, 26, 2, 1);
        rect (12, 23, 4, 5);//right shoe
        rect (14, 22, 2, 2);
        rect (15, 21, 1, 2);
        
        fill (color2);
        rect (6, 2, 5, 4);//hat correction
        rect (4, 13, 4, 1);//overalls
        rect (7, 13, 1, 2);
        rect (7, 14, 2, 1);
        rect (8, 14, 1, 3);
        rect (8, 16, 2, 3);
        rect (7, 18, 4, 2);
        rect (6, 19, 7, 4);
        rect (10, 13, 1, 2);
        rect (11, 15, 1, 2);
        rect (12, 17, 1, 2);
        rect (3, 20, 9, 4);
        rect (4, 23, 2, 2);
        rect (6, 23, 2, 3);
        rect (8, 23, 2, 4);
        rect (10, 23, 2, 5);
        rect (3, 25, 1, 3);
        rect (3, 26, 3, 4);
        rect (3, 27, 4, 3);
        rect (3, 27, 5, 2);
        
        fill (color3);
        rect (9, 6, 1, 3);//face correction (plastic surgery?)
        rect (13, 11, 1, 1);
        rect (0, 19, 1, 3);//left hand
        rect (0, 19, 5, 2);
        rect (1, 18, 4, 3);
        rect (2, 17, 2, 5);
        rect (2, 17, 1, 6);
        rect (1, 22, 2, 1);
        rect (11, 1, 2, 3);//right hand
        rect (12, 0, 3, 1);
        rect (12, 0, 1, 2);
        rect (14, 0, 1, 2);
        rect (14, 1, 2, 1);
        rect (15, 1, 1, 3);
        rect (11, 3, 5, 1);
        rect (9, 19, 1, 1);//buttons
        rect (12, 18, 1, 1);
        
    }
    
    marioImage[1][0].push (get (0, 0, 25, 50));
    
}//Big Mario

for (i = 0; i < 40; i ++) {
    
    background (0, 0, 0, 0);
    
    fill (255, 255, 255);
    
    if (i === 0) {
        
        rect (2, 0, 3, 1);
        rect (1, 1, 2, 1);
        rect (4, 1, 2, 1);
        rect (0, 2, 2, 5);
        rect (5, 2, 2, 5);
        rect (2, 4, 3, 1);
        rect (1, 1, 1, 2);
        rect (2, 0, 1, 2);
        rect (4, 0, 1, 2);
        rect (0, 4, 6, 1);
        
    }
    
    if (i === 1) {
        
        rect (0, 0, 2, 7);
        rect (2, 0, 4, 1);
        rect (2, 3, 4, 1);
        rect (2, 6, 4, 1);
        rect (5, 1, 2, 2);
        rect (5, 4, 2, 2);
        rect (0, 0, 3, 1);
        rect (0, 3, 3, 1);
        rect (0, 6, 3, 1);
        rect (5, 0, 1, 7);
        
    }
    
    if (i === 2) {
        
        rect (2, 0, 4, 1);
        rect (1, 1, 2, 1);
        rect (5, 1, 2, 1);
        rect (0, 2, 2, 3);
        rect (1, 5, 2, 1);
        rect (5, 5, 2, 1);
        rect (2, 6, 4, 1);
        rect (1, 1, 1, 5);
        rect (2, 0, 1, 2);
        rect (5, 0, 1, 2);
        rect (2, 5, 1, 2);
        rect (5, 5, 1, 2);
        
    }
    
    if (i === 3) {
        
        rect (0, 0, 2, 7);
        rect (2, 0, 3, 1);
        rect (2, 6, 3, 1);
        rect (4, 1, 2, 1);
        rect (4, 5, 2, 1);
        rect (5, 2, 2, 3);
        rect (0, 0, 3, 1);
        rect (0, 6, 3, 1);
        rect (4, 0, 1, 2);
        rect (4, 1, 2, 1);
        rect (5, 1, 1, 5);
        rect (4, 5, 2, 1);
        rect (4, 5, 1, 2);
        
    }
    
    if (i === 4) {
        
        rect (0, 0, 2, 7);
        rect (2, 0, 5, 1);
        rect (2, 6, 5, 1);
        rect (2, 3, 4, 1);
        
    }
    
    if (i === 5) {
        
        rect (0, 0, 2, 7);
        rect (1, 0, 6, 1);
        rect (1, 3, 5, 1);
        
    }
    
    if (i === 6) {
        
        rect (2, 0, 5, 1);
        rect (1, 1, 2, 1);
        rect (0, 2, 2, 3);
        rect (1, 5, 2, 1);
        rect (2, 6, 3, 1);
        rect (5, 3, 2, 4);
        rect (4, 3, 3, 1);
        rect (1, 1, 1, 5);
        rect (2, 0, 1, 2);
        rect (2, 5, 1, 2);
        rect (2, 6, 4, 1);
        
    }
    
    if (i === 7) {
        
        rect (0, 0, 2, 7);
        rect (1, 3, 5, 1);
        rect (5, 0, 2, 7);
        
    }
    
    if (i === 8) {
        
        rect (1, 0, 6, 1);
        rect (1, 6, 6, 1);
        rect (3, 0 , 2, 7);
        
    }
    
    if (i === 9) {
        
        rect (5, 0, 2, 6);
        rect (1, 6, 5, 1);
        rect (0, 4, 2, 2);
        rect (3, 0, 3, 1);
        
    }
    
    if (i === 10) {
        
        rect (0, 0, 2, 7);
        rect (1, 3, 3, 2);
        rect (3, 2, 2, 1);
        rect (4, 1, 2, 1);
        rect (5, 0, 2, 1);
        rect (3, 5, 3, 1);
        rect (4, 6, 3, 1);
        rect (3, 4, 2, 2);
        rect (3, 2, 1, 2);
        rect (5, 0, 1, 2);
        rect (4, 5, 2, 2);
        
    }
    
    if (i === 11) {
        
        rect (1, 0, 2, 7);
        rect (2, 6, 5, 1);
        
    }
    
    if (i === 12) {
        
        rect (0, 0, 2, 7);
        rect (5, 0, 2, 7);
        rect (2, 1, 1, 3);
        rect (4, 1, 1, 3);
        rect (3, 2, 1, 3);
        rect (0, 2, 7, 2);
        rect (0, 1, 3, 2);
        rect (4, 1, 3, 2);
        
    }
    
    if (i === 13) {
        
        rect (0, 0, 2, 7);
        rect (5, 0, 2, 7);
        rect (2, 1, 1, 3);
        rect (4, 3, 1, 3);
        rect (3, 2, 1, 3);
        rect (0, 1, 3, 3);
        rect (2, 2, 2, 2);
        rect (3, 3, 2, 2);
        rect (4, 3, 2, 3);
        
    }
    
    if (i === 14) {
        
        rect (0, 1, 2, 5);
        rect (5, 1, 2, 5);
        rect (1, 0, 5, 1);
        rect (1, 6, 5, 1);
        rect (1, 0, 1, 7);
        rect (5, 0, 1, 7);
        
    }
    
    if (i === 15) {
        
        rect (0, 0, 2, 7);
        rect (1, 0, 5, 1);
        rect (5, 1, 2, 3);
        rect (1, 4, 5, 1);
        rect (5, 0, 1, 5);
        
    }
    
    if (i === 16) {
        
        rect (1, 0, 5, 1);
        rect (0, 1, 2, 5);
        rect (1, 6, 4, 1);
        rect (5, 1, 2, 4);
        rect (3, 4, 4, 1);
        rect (4, 4, 2, 2);
        rect (6, 6, 1, 1);
        rect (1, 0, 1, 7);
        rect (5, 0, 1, 2);
        
    }
    
    if (i === 17) {
        
        rect (0, 0, 2, 7);
        rect (1, 0, 5, 1);
        rect (5, 1, 2, 3);
        rect (4, 3, 2, 1);
        rect (4, 3, 1, 2);
        rect (1, 4, 4, 1);
        rect (3, 5, 3, 1);
        rect (4, 6, 3, 1);
        rect (5, 0, 1, 2);
        rect (3, 4, 2, 2);
        rect (4, 5, 2, 2);
        
    }
    
    if (i === 18) {
        
        rect (1, 0, 4, 1);
        rect (4, 1, 2, 1);
        rect (0, 1, 2, 2);
        rect (1, 3, 5, 1);
        rect (5, 4, 2, 2);
        rect (1, 6, 5, 1);
        rect (0, 5, 2, 1);
        rect (1, 0, 1, 4);
        rect (4, 0, 1, 2);
        rect (5, 3, 1, 4);
        
    }
    
    if (i === 19) {
        
        rect (1, 0, 6, 1);
        rect (3, 0, 2, 7);
        
    }
    
    if (i === 20) {
        
        rect (0, 0, 2, 6);
        rect (1, 6, 5, 1);
        rect (5, 0, 2, 6);
        
    }
    
    if (i === 21) {
        
        rect (0, 0, 2, 4);
        rect (1, 0, 1, 5);
        rect (2, 3, 1, 3);
        rect (3, 4, 1, 3);
        rect (4, 3, 1, 3);
        rect (5, 0, 1, 5);
        rect (6, 0, 2, 4);
        rect (1, 3, 2, 2);
        rect (2, 4, 3, 2);
        rect (4, 3, 2, 2);
        
    }
    
    if (i === 22) {
        
        rect (0, 0, 2, 7);
        rect (5, 0, 2, 7);
        rect (2, 3, 1, 3);
        rect (3, 2, 1, 3);
        rect (4, 3, 1, 3);
        rect (1, 3, 2, 3);
        rect (2, 3, 3, 2);
        rect (4, 3, 2, 3);
        
    }
    
    if (i === 23) {
        
        rect (0, 0, 2, 2);
        rect (5, 0, 2, 2);
        rect (0, 1, 3, 1);
        rect (4, 1, 3, 1);
        rect (1, 2, 5, 1);
        rect (2, 2, 3, 3);
        rect (1, 4, 5, 1);
        rect (0, 5, 3, 1);
        rect (4, 5, 3, 1);
        rect (0, 6, 2, 1);
        rect (5, 6, 2, 1);
        rect (1, 4, 2, 2);
        rect (4, 4, 2, 2);
        
    }
    
    if (i === 24) {
        
        rect (1, 0, 2, 3);
        rect (5, 0, 2, 3);
        rect (2, 3, 4, 1);
        rect (3, 4, 2, 3);
        rect (2, 2, 1, 2);
        rect (5, 2, 1, 2);
        
    }
    
    if (i === 25) {
        
        rect (0, 0, 7, 1);
        rect (4, 0, 3, 2);
        rect (3, 2, 3, 1);
        rect (2, 3, 3, 1);
        rect (1, 4, 3, 1);
        rect (0, 5, 3, 1);
        rect (0, 6, 7, 1);
        rect (1, 4, 2, 2);
        rect (3, 2, 2, 2);
        
    }
    
    if (i === 26) {
        
        rect (0, 2, 2, 3);
        rect (1, 1, 1, 5);
        rect (1, 5, 2, 1);
        rect (2, 0, 3, 1);
        rect (2, 6, 3, 1);
        rect (4, 1, 2, 1);
        rect (5, 2, 2, 3);
        rect (5, 4, 1, 2);
        rect (4, 0, 1, 2);
        
    }
    
    if (i === 27) {
        
        rect (1, 6, 6, 1);
        rect (2, 1, 2, 1);
        rect (3, 0, 2, 6);
        
    }
    
    if (i === 28) {
        
        rect (0, 1, 2, 1);
        rect (0, 5, 2, 1);
        rect (0, 6, 7, 1);
        rect (1, 0, 5, 1);
        rect (1, 4, 4, 1);
        rect (2, 3, 4, 1);
        rect (4, 2, 3, 1);
        rect (5, 1, 2, 1);
        rect (1, 0, 1, 2);
        rect (5, 0, 1, 2);
        rect (4, 2, 2, 2);
        rect (1, 4, 1, 2);
        
    }
    
    if (i === 29) {
        
        rect (1, 0, 6, 1);
        rect (0, 5, 2, 1);
        rect (1, 6, 5, 1);
        rect (2, 3, 4, 1);
        rect (3, 2, 2, 2);
        rect (4, 0, 2, 2);
        rect (5, 4, 2, 2);
        
    }
    
    if (i === 30) {
        
        rect (0, 3, 2, 1);
        rect (0, 4, 7, 1);
        rect (1, 2, 2, 1);
        rect (2, 1, 4, 1);
        rect (3, 0, 3, 2);
        rect (4, 2, 2, 5);
        rect (1, 2, 1, 2);
        
    }
    
    if (i === 31) {
        
        rect (0, 0, 6, 1);
        rect (0, 0, 2, 3);
        rect (0, 2, 6, 1);
        rect (0, 5, 2, 1);
        rect (1, 6, 5, 1);
        rect (5, 3, 2, 3);
        rect (5, 2, 1, 5);
        
    }
    
    if (i === 32) {
        
        rect (2, 0, 4, 1);
        rect (1, 1, 2, 1);
        rect (0, 2, 2, 4);
        rect (2, 3, 4, 1);
        rect (5, 4, 2, 2);
        rect (1, 6, 5, 1);
        
    }
    
    if (i === 33) {
        
        rect (0, 0, 7, 1);
        rect (0, 1, 2, 1);
        rect (2, 4, 2, 3);
        rect (3, 3, 2, 1);
        rect (4, 2, 2, 1);
        rect (5, 1, 2, 1);
        
    }
    
    if (i === 34) {
        
        rect (1, 0, 5, 1);
        rect (0, 1, 2, 2);
        rect (5, 1, 2, 2);
        rect (1, 3, 5, 1);
        rect (0, 4, 2, 2);
        rect (5, 4, 2, 2);
        rect (1, 6, 5, 1);
        
    }
    
    if (i === 35) {
        
        rect (0, 1, 2, 2);
        rect (1, 0, 5, 1);
        rect (1, 3, 4, 1);
        rect (1, 6, 4, 1);
        rect (4, 5, 2, 1);
        rect (5, 1, 2, 4);
        
    }
    
    if (i === 36) {
        
        rect (3, 0, 2, 6);
        rect (2, 1, 4, 3);
        rect (3, 7, 2, 1);
        
    }
    
    if (i === 37) {
        
        rect (1, 3, 6, 2);
        
    }
    
    if (i === 38) {
        
        rect (2, 0, 4, 1);
        rect (1, 1, 1, 1);
        rect (0, 2, 1, 4);
        rect (1, 6, 1, 1);
        rect (2, 7, 4, 1);
        rect (6, 6, 1, 1);
        rect (7, 2, 1, 4);
        rect (6, 1, 1, 1);
        rect (3, 2, 2, 1);
        rect (2, 3, 1, 2);
        rect (3, 5, 2, 1);
        
    }
    
    if (i === 39) {
        
        rect (1, 2, 1, 1);
        rect (2, 3, 1, 1);
        rect (3, 4, 1, 1);
        rect (4, 5, 1, 1);
        rect (5, 6, 1, 1);
        rect (5, 2, 1, 1);
        rect (4, 3, 1, 1);
        rect (2, 5, 1, 1);
        rect (1, 6, 1, 1);
    }
    
    txtImage[0].push (get (0, 0, 12.5, 12.5));
    
}//Text

for (i = 0; i < 2; i ++) {
    
    background (0, 0, 0, 0);
    
    fill (230, 156, 33); //main mushroom tops
    for (var x = 0; x < 6; x += 1) {
    
        rect (6 - x, x, 4 + 2 * x, 2);
    
    }
    rect (1, 6, 14, 6);
    rect (0, 7, 16, 4);
    
    fill (181, 49, 33); //spots on mushroom top
    if (i === 1) {
    
        fill (16, 148, 0);
    
    }
    rect (2, 6, 5, 3);
    rect (3, 5, 3, 5);
    rect (2, 11, 3, 1);
    rect (12, 7, 2, 2);
    rect (13, 8, 2, 2);
    rect (8, 2, 2, 2);
    rect (9, 1, 2, 4);
    rect (10, 2, 2, 3);
    rect (11, 3, 2, 1);
    rect (11, 11, 3, 1);
    
    fill (252, 252, 252); //mushroom bottom
    rect (4, 12, 8, 3);
    rect (5, 11, 6, 5);
    
    fill (230, 156, 33); //mushroom bottom marks
    rect (10, 13, 1, 2);
    rect (9, 15, 1, 1);
    
    if (i === 0) {
        
        powerImage[2].push (get (0, 0, 25, 25));
        
    } else {
        
        powerImage[5].push (get (0, 0, 25, 25));
        
    }

}//Mushroom

for (i = 0; i < 2; i ++) {
    
    for (j = 0; j < 4; j ++) {
        
        background (0, 0, 0, 0);
    
        var color1 = color (230, 156, 33);
        var color2 = color (181, 49, 33);
        var color3 = color (252, 252, 252);
        
        if (j === 1) {
            
            color1 = color (156, 74, 0);
            color2 = color (0, 0, 0);
            color3 = color (255, 206, 197);
            
        }
        if (j === 2) {
            
            color1 = color (107, 107, 0);
            color3 = color (230, 156, 33);
            
        }
        if (j === 3) {
            
            color2 = color (16, 148, 0);
            
        }
        
        if (i === 0) {
            
            fill (16, 148, 0);
            rect (0, 9, 3, 1);
            rect (1, 10, 3, 2);
            rect (2, 11, 3, 3);
            rect (3, 12, 3, 3);
            rect (6, 14, 4, 2);
            rect (7, 8, 2, 8);
            rect (10, 12, 3, 3);
            rect (11, 11, 3, 3);
            rect (12, 10, 3, 2);
            rect (13, 9, 3, 1);
            
            fill (color3);
            rect (0, 3, 16, 2);
            rect (1, 2, 14, 4);
            rect (2, 1, 12, 6);
            rect (4, 0, 8, 8);
            
            fill (color1);
            rect (2, 3, 12, 2);
            rect (4, 2, 8, 4);
            
            fill (color2);
            rect (5, 3, 6, 2);
            
        }
        if (i === 1) {
            
            fill (color1);
            rect (7, 0, 2, 13);
            rect (6, 2, 4, 11);
            rect (5, 4, 6, 9);
            rect (1, 5, 14, 2);
            rect (2, 7, 12, 1);
            rect (3, 8, 10, 1);
            rect (4, 9, 8, 2);
            rect (3, 11, 4, 3);
            rect (9, 11, 4, 3);
            rect (3, 14, 2, 1);
            rect (11, 14, 2, 1);
            rect (2, 14, 2, 2);
            rect (12, 14, 2, 2);
            
            fill (color2);
            rect (6, 6, 1, 3);
            rect (9, 6, 1, 3);
            
        }
        
        powerImage[i + 3].push (get (0, 0, 25, 25));
        
    }
    
}//Fire Flower and Star

for (i = 0; i < 4; i ++) {
    
    background (0, 0, 0, 0);
    
    if (i === 0) {
        
        fill (181, 49, 33);
        rect (7, 1, 2, 14);
        rect (9, 3, 1, 10);
        rect (8, 3, 2, 10);
        
        fill (230, 156, 33);
        rect (7, 1, 1, 2);
        rect (6, 3, 1, 10);
        rect (7, 13, 1, 2);
        
        fill (252, 252, 252);
        rect (6, 7, 1, 2);
        
    }
    if (i === 1) {
        
        fill (230, 156, 33);
        rect (7, 1, 2, 14);
        rect (6, 2, 4, 12);
        rect (5, 3, 6, 10);
        rect (4, 5, 8, 6);
        
        fill (252, 252, 252);
        rect (6, 5, 1, 6);
        rect (7, 4, 1, 1);
        rect (7, 11, 1, 1);
        
        fill (181, 49, 33);
        rect (8, 4, 1, 1);
        rect (8, 11, 1, 1);
        rect (9, 5, 1, 6);
        
    }
    if (i === 2) {
        
        fill (252, 252, 252);
        rect (7, 1, 2, 14);
        rect (6, 3, 1, 10);
        rect (6, 3, 2, 10);
        
        fill (181, 49, 33);
        rect (8, 1, 1, 2);
        rect (9, 3, 1, 10);
        rect (8, 13, 1, 2);
        
    }
    if (i === 3) {
        
        fill (230, 156, 33);
        rect (8, 1, 1, 14);
        
        fill (252, 252, 252);
        rect (8, 7, 1, 2);

    }
    
    powerImage[1].push (get (0, 0, 25, 25));
    
}//Coin States

for (i = 0; i < 4; i ++) {
    
    background (0, 0, 0, 0);
    
    var color1 = color (0, 0, 0);
    
    if (i === 0) {
        
        color1 = color (231, 156, 33);
        
    }
    if (i === 1) {
        
        color1 = color (156, 74, 0);
        
    }
    if (i === 2) {
        
        color1 = color (86, 29, 0);
        
    }
    
    if (i < 3 & i > -1) {
        
        fill (0, 0, 0);
        rect (1, 1, 5, 6);
        rect (2, 0, 3, 8);
        
        fill (156, 74, 0);
        rect (4, 7, 1, 1);
        rect (5, 6, 1, 1);
        
        fill (color1);
        rect (1, 1, 4, 5);
        rect (2, 0, 2, 7);
        
    }
    if (i === 3) {
        
        fill (0, 0, 0);
        rect (1, 5, 6, 2);
        
        fill (255, 206, 198);
        rect (2, 5, 4, 3);
        
        fill (156, 74, 0);
        rect (2, 0, 4, 2);
        rect (1, 1, 6, 3);
        rect (0, 3, 8, 3);
        
    }
    
    extra.push (get (0, 0, 25, 25));
    
}//Mini Icons

{

background (0, 0, 0, 0);

fill (156, 74, 0);//brown background
rect (1, 1, 174, 86);

fill (0, 0, 0);//black edge lines
rect (1, 87, 174, 1);
rect (175, 1, 1, 86);

fill (255, 206, 198);//light brown edge lines
rect (1, 0, 174, 1);
rect (0, 1, 1, 86);

for (var a = 0; a < 2; a += 1) {//4 squares in corners
    
    if (a === 0) {//fills black on first time around and translates to correct positions
        
        fill (0, 0, 0);
        translate (1, 1);
        
    }
    if (a === 1) {//fills light brown on second time around and translates back
        
        fill (255, 206, 198);
        translate (- 1, - 1);
        
    }
    
    rect (3, 3, 2, 2);//draws 4 rectangles (8 when you count the second time)
    rect (3, 83, 2, 2);
    rect (171, 3, 2, 2);
    rect (171, 83, 2, 2);
    
}

for (var a = 0; a < 2; a += 1) {//the actual letters
    
    if (a === 0) {//fills black on first time around and translates to correct position
        
        fill (0, 0, 0);
        translate (1, 4);
        
    }
    if (a === 1) {//fills light brown and translates back to original position
        
        fill (255, 206, 198);
        translate (- 1, - 4);
        
    }
    
    //S
    for (var i = 0; i < 2; i += 1) {//The two Ss
        
        pushMatrix ();
        
        if (i === 1) {//top part of S
            
            translate (136, 32);
            
        }
        rect (12, 8, 8, 2);
        rect (11, 9, 10, 3);
        rect (10, 11, 12, 3);
        rect (9, 13, 14, 3);
        
        if (i === 1) {//Middle part
            
            translate (0, 8);
            
        }
        rect (9, 16, 7, 2);
        rect (10, 17, 7, 3);
        rect (11, 18, 8, 3);
        rect (13, 19, 8, 3);
        rect (15, 20, 7, 3);
        
        if (i === 1) {//Bottom part
            
            translate (0, 8);
            
        }
        rect (17, 22, 6, 5);
        rect (9, 24, 14, 3);
        rect (10, 26, 12, 3);
        rect (11, 28, 10, 3);
        rect (12, 30, 8, 2);
        
        popMatrix ();
    
    }
    //U
    rect (25, 8, 6, 19);
    rect (26, 24, 12, 5);
    rect (33, 8, 6, 19);
    rect (27, 28, 10, 3);
    rect (28, 30, 8, 2);
    //P
    rect (41, 8, 6, 24);
    rect (41, 8, 11, 8);
    rect (48, 9, 4, 15);
    rect (51, 9, 2, 14);
    rect (52, 11, 2, 10);
    rect (53, 13, 2, 6);
    //E
    rect (60, 8, 11, 8);
    rect (59, 9, 2, 7);
    rect (58, 11, 2, 5);
    rect (57, 13, 6, 14);
    rect (58, 26, 2, 3);
    rect (59, 26, 2, 5);
    rect (60, 24, 11, 8);
    rect (64, 17, 6, 6);
    //R
    rect (73, 8, 11, 8);
    rect (73, 8, 6, 24);
    rect (80, 9, 5, 15);
    rect (84, 11, 2, 9);
    rect (85, 13, 2, 6);
    rect (81, 21, 5, 11);
    rect (85, 22, 2, 10);
    //M
    rect (9, 45, 6, 35);
    rect (17, 45, 6, 35);
    rect (25, 45, 6, 35);
    rect (12, 40, 5, 2);
    rect (11, 41, 7, 3);
    rect (10, 43, 9, 3);
    rect (9, 45, 22, 3);
    rect (23, 40, 5, 2);
    rect (22, 41, 7, 3);
    rect (21, 43, 9, 3);
    //A
    rect (36, 40, 8, 8);
    rect (35, 41, 10, 7);
    rect (34, 43, 12, 5);
    rect (33, 45, 6, 35);
    rect (41, 45, 6, 35);
    rect (33, 64, 14, 8);
    //Both Rs and part of B
    for (var b = 0; b < 3; b += 1) {
        
        pushMatrix ();
        if (b === 1) {//second R
            
            translate (64, 0);
            
        }
        if (b === 2) {//B
            
            translate (48, 0);
            
        }
        rect (49, 40, 11, 8);
        rect (49, 41, 12, 7);
        rect (49, 43, 13, 5);
        rect (49, 45, 14, 3);
        rect (49, 40, 6, 40);
        rect (57, 45, 6, 14);
        rect (57, 54, 5, 6);
        rect (56, 56, 5, 8);
        rect (57, 61, 5, 14);
        rect (57, 62, 6, 13);
        if (b < 2) {//Only these if the letter is an R
            
            rect (57, 69, 6, 11);
            
        }
        popMatrix ();
        
    }
    //I (Most complicated one EVER.)
    rect (65, 40, 6, 40);
    //Both Os
    for (var c = 0; c < 2; c += 1) {
        
        pushMatrix ();
        if (c === 1) {//Second O
            
            translate (56, 0);
            
        }
        rect (76, 40, 8, 8);
        rect (75, 41, 10, 7);
        rect (74, 43, 12, 5);
        rect (73, 45, 14, 3);
        rect (73, 45, 6, 30);
        rect (81, 45, 6, 30);
        rect (73, 72, 14, 3);
        rect (74, 72, 12, 5);
        rect (75, 72, 10, 7);
        rect (76, 72, 8, 8);
        popMatrix ();
        
    }
    //bottom part of B
    rect (104, 72, 4, 8);
    rect (104, 72, 5, 7);
    rect (104, 72, 6, 5);
    //parts of capital S
    rect (145, 45, 6, 13);
    rect (153, 45, 6, 11);
    rect (153, 62, 6, 13);
    rect (145, 64, 6, 11);
    //.
    rect (161, 72, 6, 8);
    
}

fill (0, 0, 0);//extra black pixels
rect (55, 16, 1, 1);//P
rect (87, 16, 1, 1);//R
rect (31, 48, 1, 1);//M
rect (47, 48, 1, 1);//A
rect (63, 48, 1, 1);//R
rect (87, 48, 1, 1);//O
rect (111, 48, 1, 1);//B
rect (127, 48, 1, 1);//R
rect (143, 48, 1, 1);//O
rect (159, 48, 1, 1);//S

titleImage = get (0, 0, 275, 137.5);
    
}//Title Screen

//casel blox
background(0, 0, 0, 0);

fill (173, 173, 173);
rect (0, 1, 2, 5);
rect (5, 1, 5, 5);
rect (13, 1, 3, 5);
rect (1, 9, 5, 5);
rect (9, 9, 5, 5);

fill (252, 252, 252);
rect (0, 0, 2, 1);
rect (4, 0, 6, 1);
rect (4, 0, 1, 6);
rect (12, 0, 1, 6);
rect (12, 0, 4, 1);
rect (0, 8, 1, 6);
rect (0, 8, 6, 1);
rect (8, 8, 1, 6);
rect (8, 8, 6, 1);

fill (99, 99, 99);
rect (2, 0, 1, 7);
rect (0, 6, 3, 1);
rect (4, 6, 7, 1);
rect (10, 0, 1, 6);
rect (12, 6, 4, 1);
rect (0, 14, 7, 1);
rect (6, 8, 1, 7);
rect (8, 14, 7, 1);
rect (14, 8, 1, 7);

blockImage[8].push (get (0, 0, 25, 25));

//casel lava
background(0, 0, 0, 0);

fill (177, 52, 37);

rect (0, 3, 6, 13);
rect (2, 2, 4, 14);
rect (3, 1, 3, 12);
rect (0, 4, 16, 12);
rect (8, 3, 6, 2);
rect (10, 2, 4, 2);
rect (11, 1, 3, 2);

fill (252, 252, 252);

rect (0, 3, 2, 1);
rect (2, 2, 1, 1);
rect (3, 1, 1, 1);
rect (4, 0, 1, 1);
rect (5, 1, 1, 3);
rect (6, 4, 2, 1);
rect (8, 3, 2, 1);
rect (10, 2, 1, 1);
rect (11, 1, 1, 1);
rect (12, 0, 1, 1);
rect (13, 1, 1, 3);
rect (14, 4, 2, 1);
rect (0, 6, 1, 1);
rect (1, 5, 1, 1);
rect (2, 6, 1, 2);
rect (5, 7, 2, 1);
rect (7, 6, 2, 1);
rect (9, 5, 1, 1);
rect (10, 6, 1, 2);
rect (13, 7, 2, 1);
rect (15, 6, 1, 1);

blockImage[8].push (get (0, 0, 25, 25));

//casel lava
background(0, 0, 0, 0);

fill (177, 52, 37);
rect (0, 0, 16, 16);

blockImage[8].push (get (0, 0, 25, 25));

popMatrix();

}

keyPressed = function() {
    
    if (keys[keyCode]) {
        
        firstClick[keyCode] = false; //makes it false so that it is only one
        
    } else {
        
        firstClick[keyCode] = true; // first time you click
        
    }
    
    keys[keyCode] = true; //adds into the keys array as true
    
}; 

keyReleased = function() {
    
    keys[keyCode] = false; //gets rid of value from keys array by setting it as false
    firstClick[keyCode] = false; //makes it false so that it is only one
    
    if (title) {
        
        title = false;
        
    }
    
};

//an array of the different blocks in a level / part of lvl
var maps = [];

//an array for the different things in the background (clouds hills etc.)
var bkgrdArray = [
    
    [
        
        [
            
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 4, 5, 5, 5, 6, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 4, 5, 5, 5, 6, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 4, 5, 5, 5, 6, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 4, 5, 5, 5, 6, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 17, 17, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 16, 20, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 17, 18, 18, 18, 17, 0, 0, 0, 0, 0],
            [0, 10, 13, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 11, 0, 0, 0, 0, 0, 0, 16, 16, 21, 16, 16, 0, 0, 15, 0, 0],
            [10, 13, 12, 14, 11, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 10, 13, 11, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 0, 0, 0, 10, 13, 12, 14, 11, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 10, 13, 11, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 0, 0, 0, 10, 13, 12, 14, 11, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 10, 13, 11, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 10, 13, 12, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 10, 13, 11, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 12, 14, 11, 0, 0, 0, 0, 0, 16, 16, 22, 16, 16, 3, 10, 13, 11, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        
        ], //normal level, includes the end castle, but no beginning castle
        
        [
            [0]
        
        ] //underground level, no backgrounds
        
    ], //level 1
    
    [
        
        [
        
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0],
            [ 0,17,17,17, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0],
            [ 0,19,16,20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [17,18,18,18,17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [16,16,21,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [16,16,22,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        
        ], //beginning of the level (beginning castle) this part is done automatically by mario
        
        [
            
            [0]
            
        ], //underworld level, no backgrounds :D
        
        [
            
            [0]
            
        ], //under the underworld but still in underworld :D
        
        [
            
            [0],
            [0],
            [0, 0, 0, 0, 4, 5, 5, 6],
            [0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9],
            [0],
            [0],
            [0],
            [0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 17, 17],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 16, 19],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 17, 18, 18, 18, 17],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 11, 0, 0, 0, 0, 0, 0, 16, 16, 21, 16, 16],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 12, 14, 11, 0, 0, 0, 0, 0, 16, 16, 22, 16, 16, 3],
            [0],
            [0],
            
        ] //finally outside! backgrounds including the main castle
        
    ], //level 2
    
    [
        
        [
            
            [0],
            [0],
            [0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,17,17,17, 0, 4, 5],
            [ 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0,19,16,20, 0, 7, 8],
            [ 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0, 0,17,18,18,18,17],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,21,16,16],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,22,16,16],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23, 0, 0, 0, 0, 0, 4, 5, 6, 7, 8, 9,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23, 0, 0, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5,17,17,18,18,18,18,18,17,17],
            [ 0,17,17,17, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8,16,16,16,21,16,21,16,16,16],
            [ 0,19,16,20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23, 0, 0,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,22,16,22,16,16,16],
            [17,18,18,18,17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0,23,23,23, 0, 0,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0,23, 0, 0, 0, 0, 0,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16,16,16,16,16],
            [16,16,21,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0,23,23,23, 0, 0,23,23,23,23,23, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0,23, 0, 0, 0, 0, 4,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,21,16,21,16,21,16,16],
            [16,16,22,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0,23,23,23, 0, 0,23,23,23,23,23, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0, 0,23, 0, 0, 0, 0, 7,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0,23,23, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,22,16,22,16,22,16,16],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0,23, 0, 0,23,23,23, 0, 0,23,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23, 0, 0, 0, 0, 0,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0,23, 0, 0,23,23,23, 0, 0,23,23,23,23,23, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0, 0, 0, 0,23,23,23, 0, 0, 0,23,23,23, 0, 0,23, 0, 0, 0, 0, 0,23,23,23,23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23,23, 0, 0, 0, 0,23,23,23,23,23,23, 0, 0, 0,23, 0, 0,23,23, 0, 0, 0, 0,23,23],
            
        ] //main level
        
    ], //level 3 scrub
    
    [
        
        [
            
            [0],
            [0]
            
        ], //no background...
        
    ]

];

//a function for deleting a value from the maps array (changing it to a specific value, usually 0)
var valueDelete = function(x, y, value) {
    
    maps[levelNum][lvlStage][floor(y/25)][floor(x/25)] = value;
    
};

var txt = function (message, x, y) {
    
    for (var a = 0; a < message.length; a ++) {//actual letters
        
        var letter = message.charAt(a);
        
        var code = -1;
        
        if (letter === "A") {
            code = 0;
        }
        else if (letter === "B") {
            code = 1;
        }
        else if (letter === "C") {
            code = 2;
        }
        else if (letter === "D") {
            code = 3;
        }
        else if (letter === "E") {
            code = 4;
        }
        else if (letter === "F") {
            code = 5;
        }
        else if (letter === "G") {
            code = 6;
        }
        else if (letter === "H") {
            code = 7;
        }
        else if (letter === "I") {
            code = 8;
        }
        else if (letter === "J") {
            code = 9;
        }
        else if (letter === "K") {
            code = 10;
        }
        else if (letter === "L") {
            code = 11;
        }
        else if (letter === "M") {
            code = 12;
        }
        else if (letter === "N") {
            code = 13;
        }
        else if (letter === "O") {
            code = 14;
        }
        else if (letter === "P") {
            code = 15;
        }
        else if (letter === "Q") {
            code = 16;
        }
        else if (letter === "R") {
            code = 17;
        }
        else if (letter === "S") {
            code = 18;
        }
        else if (letter === "T") {
            code = 19;
        }
        else if (letter === "U") {
            code = 20;
        }
        else if (letter === "V") {
            code = 21;
        }
        else if (letter === "W") {
            code = 22;
        }
        else if (letter === "X") {
            code = 23;
        }
        else if (letter === "Y") {
            code = 24;
        }
        else if (letter === "Z") {
            code = 25;
        }
        else if (letter === "0") {
            code = 26;
        }
        else if (letter === "1") {
            code = 27;
        }
        else if (letter === "2") {
            code = 28;
        }
        else if (letter === "3") {
            code = 29;
        }
        else if (letter === "4") {
            code = 30;
        }
        else if (letter === "5") {
            code = 31;
        }
        else if (letter === "6") {
            code = 32;
        }
        else if (letter === "7") {
            code = 33;
        }
        else if (letter === "8") {
            code = 34;
        }
        else if (letter === "9") {
            code = 35;
        }
        else if (letter === "!") {
            code = 36;
        }
        else if (letter === "-") {
            code = 37;
        }
        else if (letter === "©") {
            code = 38;
        }
        else if (letter === "×") {
            code = 39;
        }
        
        if (code >= 0) {
            
            image(txtImage[0][code], x + 12.5*a, y);
            
        }
        
    }
    
};

background(107, 140, 255);

//goes through maps array at first level
for (var i = 0; i < bkgrdArray[0][0].length; i ++) {
    
    for (var j = 0; j < bkgrdArray[0][0][i].length; j ++) {
        
        if (bkgrdArray[0][0][i][j] > 0 & bkgrdArray[0][0][i][j] < 30) {
            
            image(bkgrdImage[bkgrdArray[0][0][i][j] - 1], j*25, i*25);
            
        }
    }
    
} //end of going through maps array

//draws the ground blocks in the title screen
for (var i = 0; i < 16; i ++) {
    
    image(blockImage[0][0], i*25, 350);
    image(blockImage[0][0], i*25, 375);
    
}

image(marioImage[0][0][0], 50, 325);

image(titleImage, 62.5, 50);

txt ("©1985 NINTENDO", 162.5, 187.5, true);
txt ("1 PLAYER GAME", 137.5, 225);
txt ("2 PLAYER GAME", 137.5, 250);
txt ("TOP- " + highscore, 150, 287.5);

var drawTitle = get(0, 0, 400, 400);

draw = function() {
    
    var blockType = 0;
    
    if ((levelNum === 0 & lvlStage === 1) | (levelNum === 1 & lvlStage === 1) | (levelNum === 1 & lvlStage === 2)) {
        
        blockType = 1;
        
    }
    
    //first variable used to initialize a level
    if (title) {
        
        background(107, 140, 255);
        
        //draws the title screen image background
        image(drawTitle, 0, 0);
        
    } else if (death[0]) {
        
        //draws all the text on the death screen
        
        background(0, 0, 0);
        
        if (lives > 0) {
            
            txt("WORLD 1-" + (levelNum + 1), 125, 125);
            
            image(marioImage[0][0][1], 150, 187.5);
            
            txt("×  " + lives, 187.5, 200);
            
        } else {
            
            txt("GAME OVER", 137.5, 187.5);
            
        }
        
        if (death[1] > 0) { //if timer has not gone off
            
            death[1] --; //timer!
            
        } else { //once timer is at 0
            
            if (lives > 0) {
                
                death[0] = false; //no longer on that screen
                timeLeft = 400; //time resets
                
            } else {
                
                //RESET ALL VARIABLES
                
                //x, y, xvel, yvel, left open, right open, down open, up open
                player = [50, 325, 0.01, 0, true, true, true, true];
                
                if (levelNum !== 3) {
                    
                    player = [50, 125, 0.01, 0, true, true, true, true];
                    
                }
                
                //is dead? how long until alive?
                death = [false, 0];
                
                //for the dying animation
                dying = [false, -10];
                
                //variable for whether or not the title screen is up
                title = true;
                
                //big, invincible, fireflower
                powerups = [false, false, false];
                
                //a variable which is 25 when mario is bigger, in order to keep from haveing too much code (ifs)
                yInc = 0;
                
                //a timer for how long mario is invincible
                invincible = 0;
                
                //a timer for the few frames mario has to recover
                recover = 0;
                
                //whether or not he is jumping (used for the sprites)
                jump = false;
                
                //the directional mario faces
                goingLeft = false;
                
                //a currently empty array of blocks which will later hold a list of all the walls
                blocks = [];
                
                //a currently empty array for the items inn the background
                bkgrdBlocks = [];
                
                //an array of the different types of enemies
                enemy = [];
                
                //an array for all the coins
                coins = [];
                
                //an array for all the pipes
                pipes = [];
                
                //an array for all moving platforms
                platform = [];
                
                //current level
                levelNum = 0;
                
                //for underground parts of a level or things like
                lvlStage = 0;
                
                //used to set up at the beginning of a level
                first = true;
                
                //where the flag is (starts out way far, so that if you don't define it, you can't finish!)
                endX = 10000000;
                
                //whether or not the player has crossed the flag
                endLevel = false;
                
                //whether or not the player is going between tubes
                pipeMov = [false, 0, 0, 0, 0, 0, false];
                
                //where you translate it
                translatePos = 0;
                
                //the score you currently have (high score purposes)
                score = 0;
                
                //the score when you finished a level or something
                savedScore = 0;
                
                //the time until you automatically die
                timeLeft = 400;
                
                //how many coins you have
                coin = 0;
                
                //when after player dies, this is run once!
                playerReset = false;
                
                //how many lives mario has remaining
                lives = 3;
                
                //how many consecutive jumps that are earned
                enemyCount = 0;
                
                //how much the flag has come down
                flagY = 0;
                
                //variable for when you click keys
                keys = [];
                
                //a variable for only the first frame that you click
                firstClick = [];
                
                //an array of all the items that are bouning up from question blocks
                qAnimation = [];
                
                //array for the animation (or still sprite) of a goomba after it dies
                deadGoomba = [];
                
                //a timer for mario's movements
                timer = 0;
                
            }
            
        }
        
    } else if (first) {
        
        translatePos = 0; //resets translatePos to the very beginning
        flagY = 0; //resets flag height
        
            if (levelNum === 3) {
                
                player = [50, 125, 0.01, 0, true, true, true, true];
                
            }
            
        //empties all arrays storing level info
        
        for (var i = blocks.length; i > 0; i --) {
            
            blocks.pop();
            
        }
        for (var i = pipes.length; i > 0; i --) {
            
            pipes.pop();
            
        }
        for (var i = coins.length; i > 0; i --) {
            
            coins.pop();
            
        }
        for (var i = bkgrdBlocks.length; i > 0; i --) {
            
            bkgrdBlocks.pop();
            
        }
        for (var i = platform.length; i > 0; i --) {
            
            platform.pop();
            
        }
        
        //x, y, xvel, yvel, type, active?, type of that specific enemy, addition variable > various uses
        //not many enemies, so enemies are added manually!
        if (levelNum === 0 & lvlStage === 0) {
            
            //goombas have type 0, starting type 0
            enemy = [[550, 325, -1, 0, 0, false, 0, 0], [975, 325, -1, 0, 0, false, 0, 0], [1250, 325, -1, 0, 0, false, 0, 0], [1290, 325, -1, 0, 0, false, 0, 0], [1950, 125, -1, 0, 0, false, 0, 0], [2000, 125, -1, 0, 0, false, 0, 0], [2375, 325, -1, 0, 0, false, 0, 0], [2415, 325, -1, 0, 0, false, 0, 0], [2650, 325, -1, 0, 1, false, 0, 0], [2800, 325, -1, 0, 0, false, 0, 0], [2840, 325, -1, 0, 0, false, 0, 0], [2900, 325, -1, 0, 0, false, 0, 0], [2940, 325, -1, 0, 0, false, 0, 0], [4300, 325, -1, 0, 0, false, 0, 0], [4340, 325, -1, 0, 0, false, 0, 0]];
            
        } else { //if level isnt given, there are no enemies
            
            //empty array of enemies
            for (var i = enemy.length; i > 0; i --) {
                
                enemy.pop();
                
            }
            
        }
        
        if (!pipeMov[0]) {
            
            //IMPLEMENT PIPES LAST, THEY MESS UP ALIGNMENT
            /**
            
            0       empty
            1       ground block
            2       stone block
            3       plain block
            4       plain brick block
            5       question block with coin (add 0 to draw like brick) add 1 to hide
            6       question block with coins (add 0 to draw like brick)
            7       question block with one up mushroom (add 0 to draw like brick)
            8       question block with star powerup (add 0 to draw like brick)
            9       question block with fireflower/mushroom powerup (add 0 to draw like brick)
            100 + rotation plain pipe segment EX: 101 for down or 103 for right
            [lvlStage, x, y, direction to go, rotation] pipe movable EX: [1,10,-25,1,0]
            12      pipe holding enemy
            13      coin
            14      flag
            [15, initial direction, second direction, begin x or y, end x or y, begin x or y, end x or y]
                [15,3,2,2125,2225,2225,2125]
            
            */
            //resets the map because some of the coins and question blocks were reset
            maps = [
            
                [
                
                    [
                
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 4, 5, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,71, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 4, 9, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[1,50,50,1,0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,60, 0, 0, 0, 0, 0, 4,80, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                    
                    ], //main part of level, includes pipes to other worlds and the flag to finish
                    
                    [
                        
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 0,13,13,13,13,13, 0, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100],
                        [4, 0, 0, 0,13,13,13,13,13,13,13, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100],
                        [4, 0, 0, 0,13,13,13,13,13,13,13, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0,100],
                        [4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0,[0,4037.5,300,0,2],102,100],
                        [4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0,100],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        
                    ] //can go through a pipe in main level to enter, many coins, pipe to come out
            
                ], //level 1
                
                [
                    
                    [
                        
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[1,75,50,1,2],102,100, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        
                    ], //fully automated map, mario goes through the pipe by himself
                    
                    [
                        
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[15,1,1,0,400,0,0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[15,0,0,0,0,400,0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 0, 0],
                        [4, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,70, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  4, 4, 4, 4, 4,  4, 4, 4, 4, 4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4,  4,  4,100, 0, 4, 4, 4, 4, 4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13,13,13, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13,13,13,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 4, 4, 4, 0,80, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0,13,13,13,13, 4, 4, 0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[15,1,1,0,400,0,0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[15,0,0,0,0,400,0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,13, 4, 0, 0, 4,13, 4, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4,13,90, 0, 0, 4,60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4,90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[3,87,300,0,2],102,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,100, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0,  0,100, 0, 4, 4, 4, 4, 4, 4, 4, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[2,37,25,1,0], 0, 0, 0, 0,100, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 0,100, 0, 0, 0,100, 0, 0, 0,100, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0,100, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 0,100, 0, 0, 0,100, 0, 0, 0,100, 0, 0, 0, 4, 4],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,100, 0, 0, 0, 0,100, 0, 0, 0, 0,100, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4,  4,  4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 0,100, 0, 0, 0,100, 0, 0, 0,100, 0, 0, 0, 4, 4],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,  1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,  1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1, 1, 1]
                        
                    ], //main part of level, includes first warp pipes
                    
                    [
                        
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0],
                        [4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,100],
                        [4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,100],
                        [4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,100],
                        [4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4,100],
                        [4, 0, 0, 0,13,13,13,13,13,13,13,13, 0, 4, 4,100],
                        [4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4,60, 4, 4,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4,100],
                        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[1,2837,300,0,2],102,100],
                        [4, 0, 0,13,13,13,13,13,13,13,13,13, 0, 0, 0,  0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1]
                    
                    ], //more coins... pipe to enter and exit!
                    
                    [
                        
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,  0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,100, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0,100, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        
                    ] //last segment of level, includes the flag to finish the level
                    
                ], //level 2
                
                [
                    
                    [
            
                        [0],
                        [0],
                        [0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13],
                        [0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13, 0, 0,13,13],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[15,3,2,2125,2225,2225,2125], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,[15,2,3,2325,2225,2225,2325], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16, 0, 0,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,13,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,14],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16,16, 0, 0, 0, 0, 0,16,16,16,16,16, 0,16,16,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16,16,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            
        ] //just one main level here
                    
                ], //level 3
                
                
                [
                    
                    [
                        
                        [0],
                        [0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,501, 0,0,501, 0,0,501, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,501, 0,0,501, 0,0,501, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 3, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        
                    ] //castle!!!!
                
                ], //level 4
            
            ];
            
        }
        
        //goes through maps array at specific level and stage
        for (var i = 0; i < maps[levelNum][lvlStage].length; i ++) {
            
            for (var j = 0; j < maps[levelNum][lvlStage][i].length; j ++) {
                /*
                //if it is a pipe that is plain (greater than or equal to 100)
                if (levelNum === 3) {
                    
                    if (maps[levelNum][lvlStage][i][j][0] === 1) {
                        
                        blocks.push([j*25, i*25, 21]);
                        
                    }
                    
                } else if (maps[levelNum][lvlStage][i][j][0] === 15) {
                    
                    //x, y, direction 1, direction 2, start value, end value, start value, end value
                    platform.push([j*25, i*25, maps[levelNum][lvlStage][i][j][1], maps[levelNum][lvlStage][i][j][2], maps[levelNum][lvlStage][i][j][3], maps[levelNum][lvlStage][i][j][4], maps[levelNum][lvlStage][i][j][5], maps[levelNum][lvlStage][i][j][6], true]);
                    
                } else */if (maps[levelNum][lvlStage][i][j] >= 100) {
                    
                    //100 or 101 is vertical (facing up or down)
                    if (maps[levelNum][lvlStage][i][j] <= 101) {
                    
                        pipes.push([j*25, i*25, maps[levelNum][lvlStage][i][j]]); //adds a value to pipe array
                        blocks.push([j*25, i*25, 0]); //add a block at x and y and to the right
                        blocks.push([j*25 + 25, i*25, 0]);
                        
                    } else { //102 or 103 is horizontal (facing left or right)
                        
                        pipes.push([j*25, i*25, maps[levelNum][lvlStage][i][j]]); //adds a value to pipe array
                        blocks.push([j*25, i*25, 0]); //add a block at x and y and to the bottom
                        blocks.push([j*25, i*25 + 25, 0]);
                        
                    }
                    
                } else if (maps[levelNum][lvlStage][i][j].length > 1) { //pipe thats an array
                    
                    if (maps[levelNum][lvlStage][i][j][4] <= 1) { //facing up or down
                    
                        pipes.push([j*25, i*25, maps[levelNum][lvlStage][i][j]]); //adds value to pipe array
                        blocks.push([j*25, i*25, 0]); //add a block at x and y and to the right
                        blocks.push([j*25 + 25, i*25, 0]); 
                        
                    } else { //facing left or right
                        
                        pipes.push([j*25, i*25, maps[levelNum][lvlStage][i][j]]); //adds a value to pipe array
                        blocks.push([j*25, i*25, 0]); //add a block at x and y and to the bottom
                        blocks.push([j*25, i*25 + 25, 0]);
                        
                    }
                    
                } else if ((maps[levelNum][lvlStage][i][j] > 0 & maps[levelNum][lvlStage][i][j] < 10) | maps[levelNum][lvlStage][i][j] >= 50 | maps[levelNum][lvlStage][i][j] === 16) { //if it will act as a normal block
                    
                    if (levelNum === 3) {
                        
                        blocks.push([j*25, i*25, maps[levelNum][lvlStage][i][j], 0, false, 0]);
                        
                        blocks[blocks.length - 1].push(0);
                        if (maps[levelNum][lvlStage][i][j] === 2) {
                            
                            for (var k = (i*25 + 25); k < 400; k += 25) {
                                
                                blocks.push([j*25, k, 8, 0, false, 0]);
                                blocks[blocks.length - 1].push(1);
                                
                            }
                            
                        }
                        
                    } else {
                        
                        //x, y, type, y bounce height, isBouncing?, bounce y velocity, times to be hit
                        blocks.push([j*25, i*25, maps[levelNum][lvlStage][i][j], 0, false, 0]);
                        
                        //adds a 7th value (times to be hit)
                        if (maps[levelNum][lvlStage][i][j] === 6 | maps[levelNum][lvlStage][i][j] === 60 | maps[levelNum][lvlStage][i][j] === 61) { //coin block - 10 coins
                            
                            blocks[blocks.length - 1].push(10);
                            
                        } else { //otherwise one hit finishes it
                            
                            blocks[blocks.length - 1].push(1);
                            
                        }
                        
                    }
                    
                } else if (maps[levelNum][lvlStage][i][j] === 13) { //a coin
                    
                    coins.push([j*25, i*25]); //adds a value to the coins array
                    
                } else if (maps[levelNum][lvlStage][i][j] === 14) { //the end
                    
                    endX = j*25; //sets the endX to the corresponding x value
                    blocks.push([j*25, 325, 2]); //a stone block at the end
                    
                }
                
            }
            
        } //end of going through maps array
        
        //goes through the backgrounds array at specific level and stage
        for (var i = 0; i < bkgrdArray[levelNum][lvlStage].length; i ++) {
            
            for (var j = 0; j < bkgrdArray[levelNum][lvlStage][i].length; j ++) {
                
                if (bkgrdArray[levelNum][lvlStage][i][j] !== 0) {
                    
                    //x, y, type
                    bkgrdBlocks.push([j*25, i*25, bkgrdArray[levelNum][lvlStage][i][j]]); //adds value to background blocks array
                    
                }
                
            }
            
        }
        
        //first set to false so that this only occurs once!
        first = false;
        
    } else { //if not first (to keep from any drawing errors)
        
        //begins the major game code
        pushMatrix();
        
        //Change -0 to -translatePos to only be able to move forward or the other way around to be able to go in any direction!
        
        //if he is not on the very left 200 or the vvery right 200
        //EXCEPTIONS: level 1, underground (the pipe is cut off, but still needs to be there)
        if (player[0] >= (-translatePos + 200) & player[0] < (25*maps[levelNum][lvlStage][14].length - 200) & (!(levelNum === 0 & lvlStage === 1) & !(levelNum === 1 & lvlStage === 2))) {
            
            translatePos = -player[0] + 200; //moves the translateX to 200 more than the negative of player x to have him mario in the middle of the screen
            
        }
        
        translate(translatePos, 0); //translate to translate pos (no y change in the real game!)
        
        //usually a bright blue background
        background(107, 140, 255);
        
        //goes through the array of background blocks
        for (var i = 0; i < bkgrdBlocks.length; i ++) {
            
            //if the block is in the screen (accoringing to x translate amt)
            if (bkgrdBlocks[i][0] >= (-translatePos - 25) & bkgrdBlocks[i][0] < (-translatePos + 400)) {
                
                image(bkgrdImage[bkgrdBlocks[i][2] - 1], bkgrdBlocks[i][0], bkgrdBlocks[i][1]);
                
            }
            
        }
        
        //black background in some scenarios
        if ((lvlStage === 1 & levelNum === 0) | (lvlStage === 1 & levelNum === 1) | (lvlStage === 2 & levelNum === 1) | (lvlStage === 0 & levelNum === 3)) { //level 1, underground
            
            background(0, 0, 0); // the underworld has a black background (covering up all else);
            
        }
        
        for (var j = 0; j < enemy.length; j ++) {//x, y, xvel, yvel, type, active?, type of that specific enemy, addition variable > various uses
            
            //if it's a goomba
            if (enemy[j][4] === 0) {
                
                //normal goomba
                if (enemy[j][6] === 0) {
                    
                    //is it moving??
                    if (enemy[j][5]) {
                        
                        //goes through blocks array to see if there is movement anywhere
                        for (var i = 0; i < blocks.length; i ++) {
                            
                            if (!endLevel & blocks[i][0] > (enemy[j][0] - 30) & blocks[i][0] < (enemy[j][0] + 30) & blocks[i][1] > (enemy[j][1] - 30) & blocks[i][1] < (enemy[j][1] + 30)) { //if the level has not ended and if mario isnt going through pipes and he is close enough to the block
                                
                                //begins collision
                                
                                //if either the block is less than 20 or doesnt have a units digit of one (units digit of one means invisible question until hit from bottom)
                                if ((blocks[i][2]%10 !== 1 | blocks[i][2] === 21) | blocks[i][2] < 20) {
                                    
                                    //checks if something is to the left
                                    
                                    //if x is between 2.5 inside the right side and just outside the right side
                                    //y pos from way above to way below
                                    if (enemy[j][0] <= (blocks[i][0] + 25) & enemy[j][0] >= (blocks[i][0] + 20) & (enemy[j][1] > (blocks[i][1] - 20) & enemy[j][1] < (blocks[i][1] + 25))) {
                                        
                                        enemy[j][2] = 1;//sets x vel to be 1 (goes in opposite direction)
                                        
                                    }
                                    
                                    //if x is between 2.5 inside the left side and just outside the left side
                                    //y pos from way above to way below
                                    if (enemy[j][0] <= (blocks[i][0] - 20) & enemy[j][0] >= (blocks[i][0] - 25) & (enemy[j][1] > (blocks[i][1] - 25) & enemy[j][1] < (blocks[i][1] + 25))) {
                                        
                                        enemy[j][2] = -1;//sets x vel to be -1 (goes in the opposite direction)
                                        
                                    }
                                    
                                    //x is way to left or way to right
                                    //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
                                    if (enemy[j][1] >= (blocks[i][1] - 25 - enemy[j][3]) & enemy[j][1] <= (blocks[i][1] - 17.5) & enemy[j][0] > (blocks[i][0] - 25) & enemy[j][0] < (blocks[i][0] + 25)) {
                                        
                                        enemy[j][1] = blocks[i][1] - 25;//y is just outside (remember that huge 8.5 gap?)
                                        enemy[j][3] = 0;//sets yvel to 0
                                        
                                    }
                                
                                } //end of the not invisible if statement
                                
                            } //ends collision
                            
                        } //end of going through blocks array
                        
                        //established gravity for the goomba!
                        enemy[j][3] += 0.2;
                        
                        enemy[j][0] += enemy[j][2]; //change x by xvel
                        enemy[j][1] += enemy[j][3]; //change y by yvel
                        
                        //10 frames of each type of goomba drawing
                        if (frameCount%24 < 12) {
                            
                            enemyDraw(enemy[j][0], enemy[j][1], 0, true, 0); //left foot out
                            
                        } else if (enemy[j]) { //only displys if it isnt dead
                            
                            enemyDraw(enemy[j][0], enemy[j][1], 0, false, 0); //right foot out
                            
                        }
                        
                        //if player has hit goomba from any angle
                        if (player[0] > (enemy[j][0] - 25) & player[0] < (enemy[j][0] + 25) & player[1] > (enemy[j][1] - 25 - yInc) & player[1] < (enemy[j][1] + 25) & !dying[0]) {
                            
                            if (player[1] < (enemy[j][1] - 17.5 - yInc)) { //if he hits the goomba from above
                                
                                player[3] = -5; //bounce the player up
                                
                                if (keys[UP]) {
                                    
                                    player[3] = -6.5; ///if you click up, he bounces a little higher!
                                    
                                }
                                
                                enemyCount ++; //increase the count for how many times he bounced an an enemy falling
                                
                                var power = 1; //variable for the power of two a score increases by
                                for (var i = 0; i < (enemyCount - 1); i ++) { //starts at 2^0
                                    
                                    power *= 2; //multiplies by 2 every time
                                    
                                }
                                if (enemyCount <= 4) {
                                    
                                    score += 100*power; //power multiplied by 100
                                    points.push([enemy[j][0] + translatePos, enemy[j][1], (100*power).toString(), enemy[j][1], true]);
                                    
                                } else if (enemyCount <= 8) {
                                    
                                    score += 1000*(power/16); //power resets back to 1 and starts over, but the multiplier is 1000
                                    points.push([enemy[j][0] + translatePos, enemy[j][1], (1000*power/16).toString(), enemy[j][1], true]);
                                    
                                } else {
                                    
                                    lives ++; //1 UP!
                                    points.push([player[0] + translatePos, player[1], "3", player[1], true]);
                                    
                                } //score increase is 100 200 400 800 1000 2000 4000 8000 1UP 1UP 1UP 1UP
                                
                                //x, y, non moving goomba
                                enemy[j] = [enemy[j][0], enemy[j][1], 0, 0, 0, true, 1, 40];
                                
                            } else if (recover === 0) { //player hits goomba from sides or bottom
                                
                                if (powerups[0]) {
                                    
                                    powerups[0] = false;
                                    player[1] += 25;
                                    yInc = 0;
                                    recover = 50;
                                    
                                } else if (recover === 0) {
                                    
                                    dying = [true, -10, 0];
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                    //if he is within a good distance from the screen
                    if (enemy[j][0] > (-translatePos - 50) & enemy[j][0] < (-translatePos + 425)) {
                        
                        enemy[j][5] = true; //WELL GET MOVING YOU DON'T HAVE ALL DAY (sets moving? to true)
                        
                    }
                    
                    if (enemy[j][1] > 400) { //if the goomba fell off the screen
                        
                        //deletes
                        enemy[j] = false; //get rid of the specific enemy
                        
                    }
                    
                    if (enemy[j][0] < 0) { //if it reaches the left side of the screen
                        
                        enemy[j][2] = 1; //send it the other way
                        enemy[j][0] = 0; //move it back onto the screen
                        
                    }
                    
                } else if (enemy[j][6] === 1) { //dead goomba
                    
                    if (enemy[j][7] > 0) { //if there is still time
                        
                        enemyDraw(enemy[j][0], enemy[j][1], 0, false, 1); //draws a squished goomba
                        
                        enemy[j][7] --; //timer counting down!
                        
                    } else { //OUT OF TIME
                        
                        enemy[j] = false; //no more squished goomba
                        
                    }
                    
                } else if (enemy[j][6] === 2) { //flying away goomba
                    
                    if (enemy[j]) {
                        
                        enemyDraw(enemy[j][0], enemy[j][1], 0, false, 2);
                        
                    }
                    
                    enemy[j][3] += 0.2;
                    
                    enemy[j][0] += enemy[j][2];
                    enemy[j][1] += enemy[j][3];
                    
                    if (enemy[j][1] > 400) {
                        
                        enemy[j] = false;
                        
                    }
                    
                }
                
            } else if (enemy[j][4] === 1) {
                
                //normal green koopa troopa
                if (enemy[j][6] === 0) {
                    
                    //is it moving around?
                    if (enemy[j][5]) {
                        
                        //goes through blocks array to see if there is movement anywhere
                        for (var i = 0; i < blocks.length; i ++) {
                            
                            if (!endLevel & blocks[i][0] > (enemy[j][0] - 30) & blocks[i][0] < (enemy[j][0] + 30) & blocks[i][1] > (enemy[j][1] - 30) & blocks[i][1] < (enemy[j][1] + 30)) { //if the level has not ended and he is close enough to the block
                                
                                //begins collision
                                
                                //if either the block is less than 20 or doesnt have a units digit of one (units digit of one means invisible question until hit from bottom)
                                if ((blocks[i][2]%10 !== 1 | blocks[i][2] === 21) | blocks[i][2] < 20) {
                                    
                                    //checks if something is to the left
                                    
                                    //if x is between 2.5 inside the right side and just outside the right side
                                    //y pos from way above to way below
                                    if (enemy[j][0] <= (blocks[i][0] + 25) & enemy[j][0] >= (blocks[i][0] + 20) & (enemy[j][1] > (blocks[i][1] - 20) & enemy[j][1] < (blocks[i][1] + 25))) {
                                        
                                        enemy[j][2] = 1;//sets x vel to be 1 (goes in opposite direction)
                                        
                                    }
                                    
                                    //if x is between 2.5 inside the left side and just outside the left side
                                    //y pos from way above to way below
                                    if (enemy[j][0] <= (blocks[i][0] - 20) & enemy[j][0] >= (blocks[i][0] - 25) & (enemy[j][1] > (blocks[i][1] - 25) & enemy[j][1] < (blocks[i][1] + 25))) {
                                        
                                        enemy[j][2] = -1;//sets x vel to be -1 (goes in the opposite direction)
                                        
                                    }
                                    
                                    //x is way to left or way to right
                                    //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
                                    if (enemy[j][1] >= (blocks[i][1] - 25 - enemy[j][3]) & enemy[j][1] <= (blocks[i][1] - 17.5) & enemy[j][0] > (blocks[i][0] - 25) & enemy[j][0] < (blocks[i][0] + 25)) {
                                        
                                        enemy[j][1] = blocks[i][1] - 25;//y is just outside (remember that huge 8.5 gap?)
                                        enemy[j][3] = 0;//sets yvel to 0
                                        
                                    }
                                
                                } //end of the not invisible if statement
                                
                            } //ends collision
                            
                        } //end of going through blocks array
                        
                        //established gravity for the koopa troopa!
                        enemy[j][3] += 0.2;
                        
                        enemy[j][0] += enemy[j][2]; //change x by xvel
                        enemy[j][1] += enemy[j][3]; //change y by yvel
                        
                        if (enemy[j]) { //only displays if it isnt dead
                            
                            if (enemy[j][2] < 0) {
                                
                                if (frameCount%24 < 12) {
                                    
                                    enemyDraw(enemy[j][0], enemy[j][1], 1, false, 0);
                                    
                                } else {
                                    
                                    enemyDraw(enemy[j][0], enemy[j][1], 1, false, 1);
                                    
                                }
                                
                            } else {
                                
                                if (frameCount%24 < 12) {
                                    
                                    enemyDraw(enemy[j][0], enemy[j][1], 1, true, 0);
                                    
                                } else {
                                    
                                    enemyDraw(enemy[j][0], enemy[j][1], 1, true, 1);
                                    
                                }
                                
                            }
                            
                        }
                        
                        //if player has hit koopa from any angle
                        if (player[0] > (enemy[j][0] - 25) & player[0] < (enemy[j][0] + 25) & player[1] > (enemy[j][1] - 25 - yInc) & player[1] < (enemy[j][1] + 25) & !dying[0]) {
                            
                            if (player[1] < (enemy[j][1] - 17.5 - yInc)) { //if he hits the koopa from above
                                
                                player[3] = -5; //bounce the player up
                                
                                if (keys[UP]) {
                                    
                                    player[3] = -8;
                                    
                                }
                                
                                points.push([enemy[j][0] + translatePos, enemy[j][1], "100", enemy[j][1], true]);
                                score += 100;
                                
                                //x, y, non moving koopa
                                enemy[j] = [enemy[j][0], enemy[j][1], 0, 0, 1, true, 1, 40];
                                
                            } else if (recover === 0) { //player hits goomba from sides or bottom
                                
                                if (powerups[0]) {
                                    
                                    powerups[0] = false;
                                    player[1] += 25;
                                    yInc = 0;
                                    recover = 50;
                                    
                                } else if (recover === 0) {
                                    
                                    dying = [true, -10, 0];
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                    //if he is within a good distance from the screen
                    if (enemy[j][0] > (-translatePos - 50) & enemy[j][0] < (-translatePos + 425)) {
                        
                        enemy[j][5] = true; //WELL GET MOVING YOU DON'T HAVE ALL DAY (sets moving? to true)
                        
                    }
                    
                    if (enemy[j][1] > 400) { //if the koopa fell off the screen
                        
                        //deletes
                        enemy[j] = false; //get rid of the specific enemy
                        
                    }
                    
                    if (enemy[j][0] < 0) { //if it reaches the left side of the screen
                        
                        enemy[j][2] = 1; //send it the other way
                        enemy[j][0] = 0; //move it back onto the screen
                        
                    }
                    
                } else if (enemy[j][6] === 1) { //normal shell flying around
                    
                    //goes through blocks array to see if there is movement anywhere
                    for (var i = 0; i < blocks.length; i ++) {
                        
                        if (!endLevel & blocks[i][0] > (enemy[j][0] - 30) & blocks[i][0] < (enemy[j][0] + 30) & blocks[i][1] > (enemy[j][1] - 30) & blocks[i][1] < (enemy[j][1] + 30)) { //if the level has not ended and he is close enough to the block
                            
                            //begins collision
                            
                            //if either the block is less than 20 or doesnt have a units digit of one (units digit of one means invisible question until hit from bottom)
                            if (blocks[i][2]%10 !== 1 | blocks[i][2] < 20) {
                                
                                //checks if something is to the left
                                
                                //if x is between 2.5 inside the right side and just outside the right side
                                //y pos from way above to way below
                                if (enemy[j][0] <= (blocks[i][0] + 25) & enemy[j][0] >= (blocks[i][0] + 20) & (enemy[j][1] > (blocks[i][1] - 20) & enemy[j][1] < (blocks[i][1] + 25))) {
                                    
                                    enemy[j][2] = 3;//sets x vel to be 1 (goes in opposite direction)
                                    
                                }
                                
                                //if x is between 2.5 inside the left side and just outside the left side
                                //y pos from way above to way below
                                if (enemy[j][0] <= (blocks[i][0] - 20) & enemy[j][0] >= (blocks[i][0] - 25) & (enemy[j][1] > (blocks[i][1] - 25) & enemy[j][1] < (blocks[i][1] + 25))) {
                                    
                                    enemy[j][2] = -3;//sets x vel to be -1 (goes in the opposite direction)
                                    
                                }
                                
                                //x is way to left or way to right
                                //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
                                if (enemy[j][1] >= (blocks[i][1] - 25 - enemy[j][3]) & enemy[j][1] <= (blocks[i][1] - 17.5) & enemy[j][0] > (blocks[i][0] - 25) & enemy[j][0] < (blocks[i][0] + 25)) {
                                    
                                    enemy[j][1] = blocks[i][1] - 25;//y is just outside (remember that huge 8.5 gap?)
                                    enemy[j][3] = 0;//sets yvel to 0
                                    
                                }
                            
                            } //end of the not invisible if statement
                            
                        } //ends collision
                        
                    } //end of going through blocks array
                    
                    //if player has hit koopa from any angle
                    if (player[0] > (enemy[j][0] - 25) & player[0] < (enemy[j][0] + 25) & player[1] > (enemy[j][1] - 25 - yInc) & player[1] < (enemy[j][1] + 25) & !dying[0]) {
                        
                        if (enemy[j][2] === 0 & !(player[3] === -5 | player[3] === -8)) { //the koopa shell is still, player is
                            
                            if (player[1] < (enemy[j][1] - 17.5 - yInc)) { //if he hits the koopa from above
                                
                                player[3] = -5; //bounce the player up
                                
                                if (keys[UP]) {
                                    
                                    player[3] = -8;
                                    
                                }
                                
                            }
                            
                            points.push([enemy[j][0] + translatePos, enemy[j][1], "400", enemy[j][1], true]);
                            score += 400;
                            
                            if (player[0] > (enemy[j][0] + 12.5)) {
                                
                                enemy[j][2] = -3;
                                
                            } else {
                                
                                enemy[j][2] = 3;
                                
                            }
                            
                        } else if (enemy[j][2] !== 0 & player[3] >= 0) {
                            
                            if (player[1] < (enemy[j][1] - 17.5 - yInc)) { //if he hits the koopa from above
                                
                                player[3] = -5; //bounce the player up
                                
                                if (keys[UP]) {
                                    
                                    player[3] = -8;
                                    
                                }
                                
                                enemy[j][2] = 0;
                                
                            } else if (recover === 0) { //player hits moving shell from sides or bottom
                            
                                if (powerups[0]) {
                                    
                                    powerups[0] = false;
                                    player[1] += 25;
                                    yInc = 0;
                                    recover = 50;
                                    
                                } else if (recover === 0) {
                                    
                                    dying = [true, -10, 0];
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                    //goes through all the other enemies to see if the shell hits them!
                    for (var k = 0; k < enemy.length; k ++) {
                        
                        if (enemy[k][0] > (enemy[j][0] - 25) & enemy[k][0] < (enemy[j][0] + 25) & enemy[k][1] > (enemy[j][1] - 25 - yInc) & enemy[k][1] < (enemy[j][1] + 25) & k !== j) {
                            //goomba in normal state
                            if (enemy[k][4] === 0 & enemy[k][6] === 0) {
                                
                                enemy[k] = [enemy[k][0], enemy[k][1], enemy[k][2], -4, 0, true, 2, 40];
                                
                                points.push([enemy[k][0] + translatePos, enemy[k][1], "100", enemy[k][1], true]);
                                score += 100;
                                
                            }
                            //koopa in normal state
                            if (enemy[k][4] === 1 & enemy[k][6] === 0) {
                                
                                enemy[k] = [enemy[k][0], enemy[k][1], enemy[k][2], -4, 1, true, 2, 40];
                                
                                points.push([enemy[k][0] + translatePos, enemy[k][1], "100", enemy[k][1], true]);
                                score += 100;
                                
                            }
                            
                        }
                        
                    }
                    
                    if (enemy[j][1] > 400) { //if the koopa fell off the screen
                        
                        //deletes
                        enemy[j] = false; //get rid of the specific enemy
                        
                    }
                    
                    enemy[j][3] += 0.2;
                    
                    enemy[j][0] += enemy[j][2];
                    enemy[j][1] += enemy[j][3];
                    
                    enemyDraw(enemy[j][0], enemy[j][1], 1, false, 2);
                    
                } else if (enemy[j][6] === 2) { //shell flying off the screen
                    
                    if (enemy[j]) {
                        
                        fill(255, 0, 0);
                        rect(enemy[j][0], enemy[j][1], 25, 25);
                        
                    }
                    
                    enemy[j][3] += 0.2;
                    
                    enemy[j][0] += enemy[j][2];
                    enemy[j][1] += enemy[j][3];
                    
                    if (enemy[j][1] > 400) {
                        
                        enemy[j] = false;
                        
                    }
                    
                } else if (enemy[j][6] === 3) {
                    
                    
                    
                } else if (enemy[j][6] === 4) {
                    
                    
                    
                }
                
            }
            
        }
        
        //resets player values to there is space everywhere (left right up down)
        player[4] = true; //left
        player[5] = true; //right
        player[6] = true; //down
        player[7] = true; //up
        
        //goes through blocks array
        for (var i = 0; i < blocks.length; i ++) {
            
            if (!dying[0] & !endLevel & !pipeMov[0]) { //if the level has not ended and if mario isnt going through pipes
                
                //begins collision
                
                //if either the block is less than 20 or doesnt have a units digit of one (units digit of one means invisible question until hit from bottom)
                if ((blocks[i][2]%10 !== 1 | blocks[i][2] === 21) | blocks[i][2] < 20) {
                    
                    //checks if something is to the left
                    
                    //if x is between 2.5 inside the right side and just outside the right side
                    //y pos from way above to way below
                    if (player[0] <= (blocks[i][0] + 25) & player[0] >= (blocks[i][0] + 20) & (player[1] > (blocks[i][1] - 20 - yInc) & player[1] < (blocks[i][1] + 25))) {
                        
                        player[4] = false; //something to the left
                        player[0] = blocks[i][0] + 25;//moves it to the outside so thats its never inside
                        player[2] = 0;//sets x vel to be 0
                        
                    }
                    
                    //if x is between 2.5 inside the left side and just outside the left side
                    //y pos from way above to way below
                    if (player[0] <= (blocks[i][0] - 20) & player[0] >= (blocks[i][0] - 25) & (player[1] > (blocks[i][1] - 25 - yInc) & player[1] < (blocks[i][1] + 25))) {
                        
                        player[5] = false;//something to the right
                        player[0] = blocks[i][0] - 25;//moves outside
                        player[2] = 0;//sets x vel to be 0
                        
                    }
                    
                    //x is way to left or way to right
                    //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
                    if (player[1] >= (blocks[i][1] - 25 - player[3] - yInc) & player[1] <= (blocks[i][1] - 17.5) & player[0] > (blocks[i][0] - 25) & player[0] < (blocks[i][0] + 25)) {
                        
                        player[6] = false;//something below
                        player[1] = blocks[i][1] - 25 - yInc;//y is just outside (remember that huge 8.5 gap?)
                        player[3] = 0;//sets yvel to 0
                        jump = false;//end of a jump
                        enemyCount = 0; //resets streak to 0
                        
                    }
                
                } //end of the not invisible if statement
                
                //up is special because when there are a lot of blocks in a row, you ma hit multiple
                //this is system makes sure you only hit one and its the right one
                
                var openLeft = true, openRight = true; //variables to see if there is a block to the left or right, initially says no block
                
                //if x is all the way to all the way right
                //y is just below to inside 7.5, taking yvel into account
                if (player[1] >= (blocks[i][1] + 17.5) & player[1] <= (blocks[i][1] + 25 - player[3]) & player[0] > (blocks[i][0] - 23) & player[0] < (blocks[i][0] + 23)) {
                    
                    //goes through array of the blocks
                    for (var j = 0; j < blocks.length; j ++) {
                        
                        //same y, x a block to the left
                        if (blocks[j][1] === blocks[i][1] &  blocks[j][0] === (blocks[i][0] - 25)) {
                            
                            openLeft = false;//block to left
                            
                        }
                        //same y, x a block to the right
                        if (blocks[j][1] === blocks[i][1] &  blocks[j][0] === (blocks[i][0] + 25)) {
                            
                            openRight = false;//block to right
                            
                        }
                        
                    }
                    
                    //if left is open then x can be all the way left
                    //if left is closed then x can only be 10 to the left (hat hits block)
                    
                    //if right is open then x can be all the way right
                    //if right is closed then x can only be 15 to the right (hat still hits block)
                    if ((openLeft | (!openLeft & player[0] > (blocks[i][0] - 10))) & (openRight | (!openRight & player[0] <= (blocks[i][0] + 15)))) {
                        
                        player[7] = false; //sets space above to false (something is above)
                        player[1] = blocks[i][1] + 25; //moves outside
                        
                        if (player[3] < 0) {
                            
                            player[3] = 1.5; //bounces off (y vel becomes 1)
                            
                            //if the block is less than 10, one of the non invisible question blocks
                            //player must be going up and adn it cannot be a plain square or unbreakable one
                            if (((blocks[i][2] > 0 & blocks[i][2] < 10) | (blocks[i][2] >= 50 & blocks[i][2] < 100)) & blocks[i][2] !== 3 & blocks[i][2] !== 2 & player[3] === 1.5 & levelNum !== 3) {
                                
                                blocks[i][4] = true; //bouncing
                                blocks[i][5] = -2; //yvel is -2 (going up)
                                blocks[i][3] = 0; //resets offset
                                
                                //goes through the array to check if you hit any enemies from below!
                                for (var k = 0; k < enemy.length; k ++) {
                                    
                                    //x is within and y is just on top the block
                                    if ((enemy[k][0] - blocks[i][0]) > -25 & (enemy[k][0] - blocks[i][0]) < 25 & (enemy[k][1] - blocks[i][1]) > -27 & (enemy[k][1] - blocks[i][1]) < -23) {
                                        
                                        //goomba in normal state
                                        if (enemy[k][4] === 0 & enemy[k][6] === 0) {
                                            
                                            enemy[k] = [enemy[k][0], enemy[k][1], enemy[k][2], -4, 0, true, 2, 40];
                                            
                                            points.push([enemy[k][0] + translatePos, enemy[k][1], "100", enemy[k][1], true]);
                                            score += 100;
                                            
                                        }
                                        //koopa in normal state
                                        if (enemy[k][4] === 1 & enemy[k][6] === 0) {
                                            
                                            enemy[k] = [enemy[k][0], enemy[k][1], enemy[k][2], -4, 1, true, 2, 40];
                                            
                                            points.push([enemy[k][0] + translatePos, enemy[k][1], "100", enemy[k][1], true]);
                                            score += 100;
                                            
                                        }
                                        
                                    }
                                    
                                }
                                //goes through the array to check if you hit any powerups from below!
                                for (var k = 0; k < qAnimation.length; k ++) {
                                    
                                    //x is within and y is just on top the block and it is a mushroom
                                    if ((qAnimation[k][0] - blocks[i][0]) > -25 & (qAnimation[k][0] - blocks[i][0]) < 25 & (qAnimation[k][1] - blocks[i][1]) > -27 & (qAnimation[k][1] - blocks[i][1]) < -23 & qAnimation[k][4] === 2) {
                                        
                                        //bounces the mushroom up
                                        qAnimation[k][3] = -3;
                                        
                                    }
                                    
                                }
                                //goes through the array to check if you hit any coins from below!
                                for (var k = 0; k < coins.length; k ++) {
                                    
                                    //x is within and y is just on top the block and it is a mushroom
                                    if ((coins[k][0] - blocks[i][0]) > -25 & (coins[k][0] - blocks[i][0]) < 25 & (coins[k][1] - blocks[i][1]) > -27 & (coins[k][1] - blocks[i][1]) < -23) {
                                        
                                        //bounces the mushroom up
                                        qAnimation.push([coins[k][0], coins[k][1] - 5, 0, -10, 1]);
                                        coins[k] = false;
                                        
                                    }
                                    
                                }
                                
                            }
                            
                            if (blocks[i][2] === 9 | blocks[i][2] === 90 | blocks[i][2] === 91) {
                                
                                //a growing mushroom
                                //x, y, xvel, yvel, type, origHeight
                                qAnimation.push([blocks[i][0], blocks[i][1] - 5, 0.75, 0, 2, blocks[i][1], false]);
                                
                            } else if (blocks[i][2] === 7 | blocks[i][2] === 70 | blocks[i][2] === 71) {
                                
                                //a one up mushroom
                                //x, y, xvel, yvel, type, origHeight
                                qAnimation.push([blocks[i][0], blocks[i][1] - 5, 0.75, 0, 3, blocks[i][1], false]);
                                
                            } else if ((blocks[i][2] >= 5 & blocks[i][2] <= 8) | (blocks[i][2] >= 50 & blocks[i][2] <= 80) | (blocks[i][2] >= 51 & blocks[i][2] <= 81)) {
                                
                                //a coin (if you didnt notice from the increase of coins XD)
                                //x, y, xvel, yvel, type
                                qAnimation.push([blocks[i][0], blocks[i][1] - 5, 0, -10, 1]);
                                
                            }
                            
                            if (powerups[0] & blocks[i][2] === 4) {
                                
                                valueDelete(blocks[i][0], blocks[i][1], 0);
                                
                                debris.push([blocks[i][0] + 6.25, blocks[i][1] + 6.25, -1, -5, 0]);
                                debris.push([blocks[i][0] + 12.5 + 6.25, blocks[i][1] + 6.25, 1, -5, 1]);
                                debris.push([blocks[i][0] + 12.5 + 6.25, blocks[i][1] + 12.5 + 6.25, 1, -3, 2]);
                                debris.push([blocks[i][0] + 6.25, blocks[i][1] + 12.5 + 6.25, -1, -3, 3]);
                                
                                //no text indication of an increase in score
                                blocks[i] = false;
                                score += 50;
                                
                            } else {
                            
                                //invisible Q blocks or visible Q block AND it has only a capacity of one
                                if ((blocks[i][2] >= 40 | (blocks[i][2] >= 5 & blocks[i][2] <= 9)) & blocks[i][6] <= 1) {
                                    
                                    blocks[i][2] = 3; //changes to plain square
                                    valueDelete(blocks[i][0], blocks[i][1], 3);
                                    
                                } else {
                                    
                                    blocks[i][6] --;
                                    
                                }
                                
                            }
                            
                        } else if (keys[UP]) {
                            
                            if (powerups[0] & blocks[i][2] === 4) {
                                
                                debris.push([blocks[i][0] + 6.25, blocks[i][1] + 6.25, -1, -5, 0]);
                                debris.push([blocks[i][0] + 12.5 + 6.25, blocks[i][1] + 6.25, 1, -5, 1]);
                                debris.push([blocks[i][0] + 12.5 + 6.25, blocks[i][1] + 12.5 + 6.25, 1, -3, 2]);
                                debris.push([blocks[i][0] + 6.25, blocks[i][1] + 12.5 + 6.25, -1, -3, 3]);
                                
                                valueDelete(blocks[i][0], blocks[i][1], 0);
                                blocks[i] = false;
                                
                                //no text indication of an increase in score
                                score += 50;
                                
                            } else {
                            
                                //invisible Q blocks or visible Q block AND it has only a capacity of one
                                if ((blocks[i][2] >= 40 | (blocks[i][2] >= 5 & blocks[i][2] <= 9)) & blocks[i][6] <= 1) {
                                    
                                    blocks[i][2] = 3; //changes to plain square
                                    valueDelete(blocks[i][0], blocks[i][1], 3);
                                    
                                } else {
                                    
                                    blocks[i][6] --;
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                } //end of up collision
                
                //bouncing and a normal block ( can be invisible or disguised )
                if (blocks[i][4] & ((blocks[i][2] > 0 & blocks[i][2] < 10) | (blocks[i][2] >= 50 & blocks[i][2] < 100))) {
                    
                    blocks[i][3] += blocks[i][5]; //increase the y offset by the y velocity
                    blocks[i][5] += 0.225; //increase the y velocity by the "gravity"
                    
                    if (blocks[i][3] >= 0) { //if the y offset comes back to its normal position
                        
                        blocks[i][4] = false; //no more bounce :(
                        blocks[i][3] = 0; //resets offset
                        
                    }
                    
                }
                
            } //ends collision
            
        } //end of going through blocks array
        
        //goes through pipes array
        for (var i = 0; i < pipes.length; i ++) {
            
            //only if the value is an array (normal pipes dont need this)
            if (pipes[i][2].length > 1) {
                
                //facing UP
                if (pipes[i][2][4] === 0) {
                    
                    //player x is completely inside the pipe, he is right on top and down arrow clicked
                    if (player[0] <= (pipes[i][0] + 22) & player[0] >= (pipes[i][0] + 3) & (player[1] >= (pipes[i][1] - 26 - yInc) & player[1] < (pipes[i][1] - 22.5)) & keys[DOWN]) {
                        
                        pipeMov[0] = true; //start moving through pipes
                        
                    }
                    
                    if (pipeMov[0]) { //if moving through pipes
                        
                        //x inside completely and y is far enough above
                        if (player[1] < (pipes[i][1] + yInc) & player[0] <= (pipes[i][0] + 25) & player[0] >= pipes[i][0]) { 
                            
                            player[1] ++; //moves player down the pipe
                            
                        } else if (player[0] <= (pipes[i][0] + 25) & player[0] >= pipes[i][0]) { //reaches the bottom but is still within the pipe's x
                            
                            lvlStage = pipes[i][2][0]; //changes the lvlStage
                            player[0] = pipes[i][2][1]; //changes player position
                            player[1] = pipes[i][2][2];
                            first = true;//sets first to be true
                            
                            pipeMov[1] = pipes[i][2][0];//sets values of pipeMov because this pipe will be deleted with first
                            pipeMov[2] = pipes[i][2][1];
                            pipeMov[3] = pipes[i][2][2];
                            pipeMov[4] = pipes[i][2][3];
                            pipeMov[5] = pipes[i][2][4];
                            
                            pipeMov[6] = true; //marks the beginning of the next stage
                            
                        }
                        
                    }
                    
                } else if (pipes[i][2][4] === 2) { //facing LEFT
                    
                    //player to direct left and y inside boundaries
                    //clicking right, or in the auto part of 1-2, where he goes into a pipe by himself
                    if (player[1] <= (pipes[i][1] + 25 - yInc) & player[1] >= pipes[i][1] & (player[0] >= (pipes[i][0] - 26) & player[0] < (pipes[i][0] - 22.5)) & (keys[RIGHT] | (levelNum === 1 & lvlStage === 0))) {
                        
                        pipeMov[0] = true; //start moving through the pipes
                        
                    }
                    
                    if (pipeMov[0]) { //if he is moving through the pipes
                        
                        //if the y values are still the same and the player isnt far enough right
                        if (player[0] < pipes[i][0] & player[1] <= (pipes[i][1] + 25 - yInc) & player[1] >= pipes[i][1]) {
                            
                            player[0] ++; //move the player right
                            
                        } else if (player[1] <= (pipes[i][1] + 25 - yInc) & player[1] >= pipes[i][1]) { //if the y value is still the same
                            
                            lvlStage = pipes[i][2][0];//change the stage
                            
                            player[0] = pipes[i][2][1];//change player's position
                            player[1] = pipes[i][2][2];
                            first = true;//initializes the new level
                            
                            pipeMov[1] = pipes[i][2][0]; //changes pipeMov values bc pipe array emptied
                            pipeMov[2] = pipes[i][2][1]; //with first
                            pipeMov[3] = pipes[i][2][2];
                            pipeMov[4] = pipes[i][2][3];
                            pipeMov[5] = pipes[i][2][4];
                            
                            pipeMov[6] = true;//begins second part (after having moved)
                            
                        }
                        
                    } //end of if moving through pipes
                    
                }
                
            } //end of if facing left
            
        } //end of going through the pipes array
        
        if (pipeMov[6]) {//if he is in the next room BEGIN PHASE TWO
            
            if (pipeMov[4] === 0) { //he goes up into the place
                
                if (player[1] > (pipeMov[3] - 25 - yInc)) { //if he isnt too high
                    
                    player[1] --; //moves the player up
                    
                } else { //once he gets high enough
                    
                    pipeMov[0] = false; //no longer moving through pipes
                    pipeMov[6] = false; //no longer stage 2 of pipe movement
                    player[3] = 0; //yvel reset to 0
                    player[2] = 0; //xvel reset to 0
                    
                }
                
            } else if (pipeMov[4] === 1) { //he descends
                
                if (player[1] < (pipeMov[3] + 25)) { //if he isnt too low
                    
                    player[1] ++; //move player down
                    
                } else { //once he goes far enough down
                    
                    pipeMov[0] = false; //no longer moving through pipes
                    pipeMov[6] = false; //no longer stage 2
                    player[2] = 0; //xvel reset to 0
                    player[3] = 0; //yvel reset to 0
                    
                }
                
            } else if (pipeMov[4] === 2) { //he goes left
                
                if (player[0] > (pipeMov[0] - 25)) { //if he isnt too far left
                    
                    player[0] --; //move the player left
                    
                } else { //once he gets far enough
                    
                    pipeMov[0] = false; //he is no longer moving through pipes
                    pipeMov[6] = false; //no longer in stage 2
                    player[2] = 0; //xvel reset to 0
                    player[3] = 0; //yvel reset to 0
                    
                }
                
            } else { //he goes right
                
                if (player[0] > (pipeMov[1] + 25)) { //if he isnt too far right
                    
                    player[0] ++; //move right
                    
                } else { //once he makes it all the way right
                    
                    pipeMov[0] = false; //no longer moving through pipes
                    pipeMov[6] = false; //no longer in stage 2
                    player[3] = 0; //yvel reset to 0
                    player[2] = 0; //xvel reset to 0
                    
                }
                
            } //end of ifs concerning which way mario comes out of the pipe
        
        } //end of if stage 2 of mario's pipe adventure
        
        for (var i = 0; i < platform.length; i ++) {
            
            //if x is between 2.5 inside the right side and just outside the right side
            //y pos from way above to way below
            if (player[0] <= (platform[i][0] + 75) & player[0] >= (platform[i][0] + 70) & (player[1] > (platform[i][1] - 20 - yInc) & player[1] < (platform[i][1] + 12.5))) {
                
                player[4] = false; //something to the left
                player[0] = platform[i][0] + 75;//moves it to the outside so thats its never inside
                player[2] = 0;//sets x vel to be 0
                
            }
            
            //if x is between 2.5 inside the left side and just outside the left side
            //y pos from way above to way below
            if (player[0] <= (platform[i][0] - 20) & player[0] >= (platform[i][0] - 25) & (player[1] > (platform[i][1] - 25 - yInc) & player[1] < (platform[i][1] + 12.5))) {
                
                player[5] = false;//something to the right
                player[0] = platform[i][0] - 25;//moves outside
                player[2] = 0;//sets x vel to be 0
                
            }
            
            //x is way to left or way to right
            //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
            if (player[1] >= (platform[i][1] - 25 - player[3] - yInc) & player[1] <= (platform[i][1] - 17.5) & player[0] > (platform[i][0] - 25) & player[0] < (platform[i][0] + 75)) {
                    
                    player[6] = false;//something below
                    player[1] = platform[i][1] - 23 - yInc;//y is just outside (remember that huge 8.5 gap?)
                    player[3] = 0;//sets yvel to 0
                    jump = false;//end of a jump
                    enemyCount = 0; //resets streak to 0
                    
                    if ((platform[8] & player[2] === 2) | (!platform[8] & player[3] === 2)) {
                        
                        player[0] -= 2;
                        
                    }
                    
                    if ((platform[8] & player[2] === 3) | (!platform[8] & player[3] === 3)) {
                        
                        player[0] += 2;
                        
                    }
                    
                }
            
            //if x is all the way to all the way right
            //y is just below to inside 7.5, taking yvel into account
            if (player[1] >= (platform[i][1] + 5) & player[1] <= (platform[i][1] + 12.5) & player[0] > (platform[i][0] - 23) & player[0] < (platform[i][0] + 73)) {
                
                player[3] = 3; //bounces it down
                player[7] = false; //something above
                
                jump = false; //ends the jump
                
            } //end of up collision
            
            //draws
            for (var j = 0; j < 3; j ++) {
                
                pushMatrix();
                
                translate(j*25 + platform[i][0], platform[i][1]);
                scale(25/16);
                
                fill (231, 156, 33);
                rect (0, 0, 2, 3);
                rect (0, 0, 1, 8);
                rect (0, 5, 16, 3);
                rect (6, 0, 3, 8);
                rect (6, 0, 4, 3);
                rect (14, 0, 2, 8);
                
                fill (177, 52, 77);
                rect (0, 0, 16, 2);
                rect (0, 7, 16, 1);
                rect (2, 5, 4, 1);
                rect (6, 3, 1, 2);
                rect (10, 5, 4, 1);
                rect (14, 3, 1, 2);
                
                fill (252, 252, 252);
                rect (0, 0, 16, 1);
                
                popMatrix();
                
            }
            
            //platform movement
            
            //0 1 2           3           4     5   6     7   8
            //x y direction 1 direction 2 start end start end onfirstone?
            if (platform[i][8]) {
                
                if (platform[i][2] === 0) { //up
                    
                    platform[i][1] -= 2;
                    
                    if (platform[i][1] <= platform[i][5]) {
                        
                        platform[i][8] = false;
                        platform[i][1] = platform[i][6];
                        
                    }
                    
                } else if (platform[i][2] === 1) { //down
                    
                    platform[i][1] += 2;
                    
                    if (platform[i][1] >= platform[i][5]) {
                        
                        platform[i][8] = false;
                        platform[i][1] = platform[i][6];
                        
                    }
                    
                } else if (platform[i][2] === 2) { //left
                    
                    platform[i][0] -= 2;
                    
                    if (platform[i][0] <= platform[i][5]) {
                        
                        platform[i][8] = false;
                        platform[i][0] = platform[i][6];
                        
                    }
                    
                } else { //right
                    
                    platform[i][0] += 2;
                    
                    if (platform[i][0] >= platform[i][5]) {
                        
                        platform[i][8] = false;
                        platform[i][0] = platform[i][6];
                        
                    }
                    
                }
                
            } else {
                
                if (platform[i][3] === 0) { //up
                    
                    platform[i][1] -= 2;
                    
                    if (platform[i][1] <= platform[i][7]) {
                        
                        platform[i][8] = true;
                        platform[i][1] = platform[i][4];
                        
                    }
                    
                } else if (platform[i][3] === 1) { //down
                    
                    platform[i][1] += 2;
                    
                    if (platform[i][1] >= platform[i][7]) {
                        
                        platform[i][8] = true;
                        platform[i][1] = platform[i][4];
                        
                    }
                    
                } else if (platform[i][3] === 2) { //left
                    
                    platform[i][0] -= 2;
                    
                    if (platform[i][0] <= platform[i][7]) {
                        
                        platform[i][8] = true;
                        platform[i][0] = platform[i][4];
                        
                    }
                    
                } else { //right
                    
                    platform[i][0] += 2;
                    
                    if (platform[i][0] >= platform[i][7]) {
                        
                        platform[i][8] = true;
                        platform[i][0] = platform[i][4];
                        
                    }
                    
                }
                
            }
            
        }
        
        for (var i = 0; i < qAnimation.length; i ++) {
            
            if (qAnimation[i][4] === 1) { //coin
                
                image(powerImage[1][floor(frameCount/6)%4], qAnimation[i][0], qAnimation[i][1]);
                
                qAnimation[i][3] += 0.625; //gravity for coin
                qAnimation[i][1] += qAnimation[i][3]; //established yvelocity
                
                if (qAnimation[i][3] > 6) { //if it is going fast enough down
                    
                    points.push([qAnimation[i][0] + translatePos, qAnimation[i][1], "200", qAnimation[i][1], true]);
                    
                    qAnimation[i] = false; //get rid of it
                    
                    score += 200;
                    coin ++; //increases amount of coins
                    
                }
                
            } else if (qAnimation[i][4] === 2) { //mushroom
                
                image(powerImage[2][0], qAnimation[i][0], qAnimation[i][1]);
                
                fill(107, 140, 255);
                //black background in some scenarios
                if ((lvlStage === 1 & levelNum === 0) | (lvlStage === 1 & levelNum === 1) | (lvlStage === 2 & levelNum === 1)) { //level 1, underground
                    
                    fill(0, 0, 0); // the underworld has a black background
                    
                }
                
                if (!qAnimation[i][6]) { //going up!
                    
                    rect(qAnimation[i][0], qAnimation[i][5], 25, 25); //cover the space under the q block when it bounces up
                    
                }
                
                if (qAnimation[i][1] > (qAnimation[i][5] - 25) & !qAnimation[i][6]) {
                    
                    qAnimation[i][1] --;
                    
                } else {
                    
                    qAnimation[i][6] = true;
                    
                }
                
                if (qAnimation[i][6]) {
                    
                    //goes through blocks array to see if there is movement anywhere
                    for (var j = 0; j < blocks.length; j ++) {
                        
                        if (!dying[0] & !endLevel & blocks[j][0] > (qAnimation[i][0] - 30) & blocks[j][0] < (qAnimation[i][0] + 30) & blocks[j][1] > (qAnimation[i][1] - 30) & blocks[j][1] < (qAnimation[i][1] + 30)) { //if the level has not ended and if mario isnt going through pipes and he is close enough to the block
                            
                            //begins collision
                            
                            //if either the block is less than 20 or doesnt have a units digit of one (units digit of one means invisible question until hit from bottom)
                            if (blocks[j][2]%10 !== 1 | blocks[j][2] < 20) {
                                
                                //checks if something is to the left
                                
                                //if x is between 2.5 inside the right side and just outside the right side
                                //y pos from way above to way below
                                if (qAnimation[i][0] <= (blocks[j][0] + 25) & qAnimation[i][0] >= (blocks[j][0] + 20) & (qAnimation[i][1] > (blocks[j][1] - 20) & qAnimation[i][1] < (blocks[j][1] + 25))) {
                                    
                                    qAnimation[i][2] = 0.75;//sets x vel to be 1 (goes in opposite direction)
                                    
                                }
                                
                                //something to the right?
                                
                                //if x is between 2.5 inside the left side and just outside the left side
                                //y pos from way above to way below
                                if (qAnimation[i][0] <= (blocks[j][0] - 20) & qAnimation[i][0] >= (blocks[j][0] - 25) & (qAnimation[i][1] > (blocks[j][1] - 25) & qAnimation[i][1] < (blocks[j][1] + 25))) {
                                    
                                    qAnimation[i][2] = -0.75;//sets x vel to be -1 (goes in the opposite direction)
                                    
                                }
                                
                                //something below?
                                
                                //x is way to left or way to right
                                //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
                                if (qAnimation[i][1] >= (blocks[j][1] - 25 - qAnimation[i][3]) & qAnimation[i][1] <= (blocks[j][1] - 17.5) & qAnimation[i][0] > (blocks[j][0] - 25) & qAnimation[i][0] < (blocks[j][0] + 25)) {
                                    
                                    qAnimation[i][1] = blocks[j][1] - 25;//y is just outside (remember that huge 8.5 gap?)
                                    qAnimation[i][3] = 0;//sets yvel to 0
                                    
                                }
                            
                            } //end of the not invisible if statement
                            
                        } //ends collision
                        
                    } //end of going through blocks array
                    
                    //established gravity for the mushroom
                    qAnimation[i][3] += 0.17;
                    
                    //if he is within a good distance from the screen
                    if (qAnimation[i][0] > (-translatePos - 50) & qAnimation[i][0] < (-translatePos + 425)) {
                        
                        qAnimation[i][9] = true; //WELL GET MOVING YOU DON'T HAVE ALL DAY (sets moving? to true)
                        
                    }
                    
                    if (qAnimation[i][0] < 0) { //if it reaches the left side of the screen
                        
                        qAnimation[i][2] = 0.75; //send it the other way
                        qAnimation[i][0] = 0; //move it back onto the screen
                        
                    }
                    
                    //moving?
                    if (qAnimation[i][9]) {
                        
                        qAnimation[i][0] += qAnimation[i][2]; //change x by xvel
                        qAnimation[i][1] += qAnimation[i][3]; //change y by yvel
                        
                    }
                    
                    qAnimation[i][1] += qAnimation[i][3]; //established yvelocity
                    qAnimation[i][0] += qAnimation[i][2]; //established yvelocity
                    
                    if (qAnimation[i][1] > 400) { //if the mushroom fell off the screen
                        
                        //deletes
                        qAnimation[i] = false; //get rid of the specific enemy
                        
                    }
                    
                    //if player has hit mushroom
                    if (player[0] > (qAnimation[i][0] - 25) & player[0] < (qAnimation[i][0] + 25) & player[1] > (qAnimation[i][1] - 25 - yInc) & player[1] < (qAnimation[i][1] + 25)) {
                        
                        if (!powerups[0]) {
                            
                            powerups[0] = true; //big mario
                            yInc = 25;
                            player[1] -= yInc; //moves him up to avoid being stuck in the ground
                            
                        }
                        
                        points.push([qAnimation[i][0] + translatePos, qAnimation[i][1], "1000", qAnimation[i][1], true]);
                    
                        //deletes
                        qAnimation[i] = false; //get rid of the specific enemy
                        score += 1000;
                        
                    }
                    
                }
                
            } else if (qAnimation[i][4] === 3) { //one up mushroom
                
                image(powerImage[5][0], qAnimation[i][0], qAnimation[i][1]);
                
                fill(107, 140, 255);
                //black background in some scenarios
                if ((lvlStage === 1 & levelNum === 0) | (lvlStage === 1 & levelNum === 1) | (lvlStage === 2 & levelNum === 1)) { //level 1, underground
                    
                    fill(0, 0, 0); // the underworld has a black background
                    
                }
                
                if (!qAnimation[i][6]) { //going up!
                    
                    rect(qAnimation[i][0], qAnimation[i][5], 25, 25); //cover the space under the q block when it bounces up
                    
                }
                
                if (qAnimation[i][1] > (qAnimation[i][5] - 25) & !qAnimation[i][6]) {
                    
                    qAnimation[i][1] --;
                    
                } else {
                    
                    qAnimation[i][6] = true;
                    
                }
                
                if (qAnimation[i][6]) {
                    
                    //goes through blocks array to see if there is movement anywhere
                    for (var j = 0; j < blocks.length; j ++) {
                        
                        if (!dying[0] & !endLevel & blocks[j][0] > (qAnimation[i][0] - 30) & blocks[j][0] < (qAnimation[i][0] + 30) & blocks[j][1] > (qAnimation[i][1] - 30) & blocks[j][1] < (qAnimation[i][1] + 30)) { //if the level has not ended and if mario isnt going through pipes and he is close enough to the block
                            
                            //begins collision
                            
                            //if either the block is less than 20 or doesnt have a units digit of one (units digit of one means invisible question until hit from bottom)
                            if (blocks[j][2]%10 !== 1 | blocks[j][2] < 20) {
                                
                                //checks if something is to the left
                                
                                //if x is between 2.5 inside the right side and just outside the right side
                                //y pos from way above to way below
                                if (qAnimation[i][0] <= (blocks[j][0] + 25) & qAnimation[i][0] >= (blocks[j][0] + 20) & (qAnimation[i][1] > (blocks[j][1] - 20) & qAnimation[i][1] < (blocks[j][1] + 25))) {
                                    
                                    qAnimation[i][2] = 0.75;//sets x vel to be 1 (goes in opposite direction)
                                    
                                }
                                
                                //something to the right?
                                
                                //if x is between 2.5 inside the left side and just outside the left side
                                //y pos from way above to way below
                                if (qAnimation[i][0] <= (blocks[j][0] - 20) & qAnimation[i][0] >= (blocks[j][0] - 25) & (qAnimation[i][1] > (blocks[j][1] - 25) & qAnimation[i][1] < (blocks[j][1] + 25))) {
                                    
                                    qAnimation[i][2] = -0.75;//sets x vel to be -1 (goes in the opposite direction)
                                    
                                }
                                
                                //something below?
                                
                                //x is way to left or way to right
                                //y is a block above to 8.5 inside the block (yvel gets up to 7.5!!!)
                                if (qAnimation[i][1] >= (blocks[j][1] - 25 - qAnimation[i][3]) & qAnimation[i][1] <= (blocks[j][1] - 17.5) & qAnimation[i][0] > (blocks[j][0] - 25) & qAnimation[i][0] < (blocks[j][0] + 25)) {
                                    
                                    qAnimation[i][1] = blocks[j][1] - 25;//y is just outside (remember that huge 8.5 gap?)
                                    qAnimation[i][3] = 0;//sets yvel to 0
                                    
                                }
                            
                            } //end of the not invisible if statement
                            
                        } //ends collision
                        
                    } //end of going through blocks array
                    
                    //established gravity for the mushroom
                    qAnimation[i][3] += 0.17;
                    
                    //if he is within a good distance from the screen
                    if (qAnimation[i][0] > (-translatePos - 50) & qAnimation[i][0] < (-translatePos + 425)) {
                        
                        qAnimation[i][9] = true; //WELL GET MOVING YOU DON'T HAVE ALL DAY (sets moving? to true)
                        
                    }
                    
                    if (qAnimation[i][0] < 0) { //if it reaches the left side of the screen
                        
                        qAnimation[i][2] = 0.75; //send it the other way
                        qAnimation[i][0] = 0; //move it back onto the screen
                        
                    }
                    
                    //moving?
                    if (qAnimation[i][9]) {
                        
                        qAnimation[i][0] += qAnimation[i][2]; //change x by xvel
                        qAnimation[i][1] += qAnimation[i][3]; //change y by yvel
                        
                    }
                    
                    qAnimation[i][1] += qAnimation[i][3]; //established yvelocity
                    qAnimation[i][0] += qAnimation[i][2]; //established yvelocity
                    
                    if (qAnimation[i][1] > 400) { //if the mushroom fell off the screen
                        
                        //deletes
                        qAnimation[i] = false; //get rid of the specific enemy
                        
                    }
                    
                    //if player has hit mushroom
                    if (player[0] > (qAnimation[i][0] - 25) & player[0] < (qAnimation[i][0] + 25) & player[1] > (qAnimation[i][1] - 25 - yInc) & player[1] < (qAnimation[i][1] + 25)) {
                        
                        lives ++;
                        points.push([qAnimation[i][0] + translatePos, qAnimation[i][1], "3", qAnimation[i][1], true]);
                        
                        //deletes
                        qAnimation[i] = false; //get rid of the specific enemy
                        
                    }
                    
                }
                
            }
            
        }
        
        for (var i = 0; i < coins.length; i ++) {
            
            if (coins[i]) {
                
                if (frameCount%24 < 12) {
                    
                    image(powerImage[0][0][0], coins[i][0], coins[i][1]);
                    
                } else if (frameCount%24 < 18) {
                    
                    image(powerImage[0][1][0], coins[i][0], coins[i][1]);
                    
                } else {
                    
                    image(powerImage[0][2][0], coins[i][0], coins[i][1]);
                    
                }
                
            }
            
            if (player[0] > (coins[i][0] - 19) & player[0] < (coins[i][0] + 15) & player[1] > (coins[i][1] - 25 - yInc) & player[1] < (coins[i][1] + 25)) {
                
                valueDelete(coins[i][0], coins[i][1], 0);
                
                coins[i] = false;
                coin ++;
                score += 200;
                
            }
            
        }
        
        for (var i = 0; i < debris.length; i ++) {
            
            if (debris[i]) {
                
                pushMatrix();
                
                translate(debris[i][0], debris[i][1]);
                
                scale(25/16);
                if (debris[i][4] === 1) {
                    
                    scale(-1, 1);
                    translate(-2, 0);
                    
                } else if (debris[i][4] === 2) {
                    
                    scale(-1, -1);
                    translate(-2, -2);
                    
                } else if (debris[i][4] === 3) {
                    
                    scale(1, -1);
                    translate(0, -2);
                    
                }
                
                rotate(floor(frameCount/9)*90);
                translate(-4, -4);
                
                noStroke ();
            
                fill (156, 74, 0);
                
                rect (3, 0, 3, 7);
                rect (2, 1, 5, 5);
                rect (1, 2, 7, 3);
                rect (1, 2, 5, 5);
                rect (0, 3, 7, 3);
                rect (2, 1, 3, 7);
                
                fill (0, 0, 0);
                
                rect (4, 0, 1, 1);
                rect (3, 1, 1, 1);
                rect (2, 2, 1, 1);
                rect (1, 3, 1, 1);
                rect (0, 4, 1, 1);
                rect (4, 2, 1, 1);
                rect (5, 3, 1, 1);
                rect (6, 2, 1, 1);
                rect (4, 4, 1, 1);
                rect (3, 5, 1, 1);
                rect (2, 6, 1, 1);
                rect (4, 6, 1, 1);
                
                popMatrix();
                
                //gravity
                debris[i][3] += 0.3;
                
                debris[i][0] += debris[i][2];
                debris[i][1] += debris[i][3];
                
                if (debris[i][1] > 400) {
                    
                    debris[i] = false;
                    
                }
                
            }
            
        }
        
        //goes max 2 x vel except when u r big
        if (!keys[RIGHT] & keys[LEFT] & player[4] & ((player[2] > -2 & !powerups[0]) | (player[2] > -2.25 & powerups[0]))) { //clicking only left, there is a space left and you aren't going too fast
            
            if (player[2] > 0) { //immediate turn left if you are going right
                
                player[2] = 0; //resets x velocity to 0
                
            }
            
            player[2] -= 0.1; //decreases x velocity slowly to create speed
            
        }
        if (!keys[LEFT] & keys[RIGHT] & player[5] & ((player[2] < 2 & !powerups[0]) | (player[2] < 2.25 & powerups[0]))) { //clicking only right, there is a space right and you aren't going too fast
            
            if (player[2] < 0) { //immediate turn right when going left
                
                player[2] = 0; //resets x velocity to 0
                
            }
            
            player[2] += 0.1; //increases x velocity y slowly creating speed
            
        }
        
        //goes max 2 x vel except when u r big
        if (!keys[RIGHT] & keys[LEFT] & player[2] > -4 & keys[88]) { //clicking only left, there is a space left and you aren't going too fast
            
            player[2] -= 0.25; //decreases x velocity slowly to create speed
            
        } else if (!keys[88] & player[2] < -2) {
            
            player[2] += 0.1;
            
        }
        //goes max 2 x vel except when u r big
        if (!keys[LEFT] & keys[RIGHT] & player[2] < 4 & keys[88]) { //clicking only left, there is a space left and you aren't going too fast
            
            player[2] += 0.25; //decreases x velocity slowly to create speed
            
        } else if (!keys[88] & player[2] > 2) {
            
            player[2] -= 0.1;
            
        }
        
        if ((!keys[LEFT] & !keys[RIGHT]) | (keys[RIGHT] & keys[LEFT])) { //if neither are held or if both are
            
            if (player[2] > 0.001) {
                
                player[2] /= 1.1; //the slow down
                
            } else {
                
                player[2] = 0;
                
            }
            
        }
        
        if (!player[6] & player[7]) { //space up but not space down
            
            if (firstClick[UP]) { //if you are holding the up button on the ground
                
                //initial upward velocity is 8
                player[3] = -8;
                
                //sets jump to true for spriting purposes
                jump = true;
                
            } else {
                
                player[3] = 0; //should not be moving up or down with no place to go down :D
                
            }
            
        } else if (player[3] < 7.5 & player[6]) { //if there is no place to go down, then
            
//                         vv     cuz 0.3 just aint gud enuf
            player[3] += 0.3165; //ENFORCE GRAVITY... BWAHAHAHAHAHA
            
        }
        
        //in the first part of 1-2, mario is moved by the 
        if (levelNum === 1 & lvlStage === 0) {
            
            player[2] = 2;
            player[3] = 0;
            
        }
        
        if (!dying[0] & !endLevel & !pipeMov[0]) { //if its not the end of the level or moving through pipes (movement there is done with casework!
            
            player[0] += player[2]; //change x by x velocity
            
            player[1] += player[3]; //change y by y velocity
            
        }
        
        if (!pipeMov[0]) {
            
            player[0] = constrain(player[0], -translatePos, 25*maps[levelNum][lvlStage][14].length - 25); //dont let the player go off the screen
        
        }
        
        if (player[2] > 0 & !jump) { //if he is going right
            
            goingLeft = false; //not going left
            
        } else if (player[2] < 0 & !jump) { //if he is going left
            
            goingLeft = true; //is going left
            
        }
        
        if (powerups[0]) {
            
            yInc = 25;
            
        } else {
            
            yInc = 0;
            
        }
        
        //drawing different stages of mario running
        
        if (recover === 0 | frameCount%24 <= 12) {
            
            if (keys[88]) {
                
                timer += 2;
                
            } else {
                
                timer ++;
                
            }
            
            pushMatrix();
            
            translate(player[0], player[1]);
            if (goingLeft) {
                
                translate(25, 0);
                scale(-1, 1);
                
            }
            
            
            if (powerups[0] & !dying[0]) {
                
                //not in the castle
                if (player[0] < (endX + 150)) {
                    
                    //passed the flag!
                    if (endLevel) {
                        
                        //on top of the block and on the floor running
                        if ((abs(player[1] - 300) < 0.2 | (player[0] < (endX + 25) & player[0] > (endX - 10))) & player[0] < (endX + 200)) { //running sequence
                            
                            //5 frames of a sequence of sprites: 2324
                            if (timer%24 < 6) {
                                
                                image (marioImage[1][0][1], 0, 0);
                                
                            } else if (timer%24 < 12) {
                                
                                image (marioImage[1][0][2], 0, 0);
                                
                            } else if (timer%24 < 18) {
                                
                                image (marioImage[1][0][1], 0, 0);
                                
                            } else {
                                
                                image (marioImage[1][0][3], 0, 0);
                                
                            }
                            
                        } else if (player[0] < endX) { //going down the flag
                            
                            image (marioImage[1][0][3], 0, 0);
                            
                        } else if (player[1] < 325) { //falling of the block
                            
                            image (marioImage[1][0][3], 0, 0);
                            
                        } else { //just standing there
                            
                            image (marioImage[1][0][0], 0, 0);
                            
                        }
                        
                    } else if (pipeMov[0]) { //going down a pipe means he isnt moving, just standing there
                        
                        image (marioImage[1][0][0], 0, 0);
                        
                    } else if (jump) { //if he is in the middle of a jump
                        
                        image (marioImage[1][0][4], 0, 0);
                        
                    } else if (abs(player[3]) > 0.1) { //falling from a non-jump
                        
                        image (marioImage[1][0][0], 0, 0);
                        
                    } else if (abs(player[2]) < 0.05 | (keys[88] & abs(player[2]) < 0.5)) { //standing still (basically)
                        
                        image (marioImage[1][0][0], 0, 0);
                        
                    } else { //running!
                        
                        //5 frames in sequence 2324
                        if (timer%24 < 6) {
                            
                            image (marioImage[1][0][1], 0, 0);
                            
                        } else if (timer % 24 < 12) {
                            
                            image (marioImage[1][0][2], 0, 0);
                            
                        } else if (timer%24 < 18) {
                            
                            image (marioImage[1][0][1], 0, 0);
                            
                        } else {
                            
                            image (marioImage[1][0][3], 0, 0);
                            
                        }
                        
                    }
                    
                }
                
            } else if (!dying[0]) {
            
                //not in the castle
                if (player[0] < (endX + 150)) {
                    
                    //passed the flag!
                    if (endLevel) {
                        
                        //on top of the block and on the floor running
                        if ((abs(player[1] - 325) < 0.2 | (player[0] < (endX + 25) & player[0] > (endX - 5))) & player[0] < (endX + 200)) { //running sequence
                            
                            //5 frames of a sequence of sprites: 2324
                            if (timer%24 < 6) {
                                
                                image (marioImage[0][0][1], 0, 0);
                                
                            } else if (timer%24 < 12) {
                                
                                image (marioImage[0][0][2], 0, 0);
                                
                            } else if (timer%24 < 18) {
                                
                                image (marioImage[0][0][1], 0, 0);
                                
                            } else {
                                
                                image (marioImage[0][0][3], 0, 0);
                                
                            }
                            
                        } else if (player[0] < endX) { //going down the flag
                            
                            image (marioImage[0][0][3], 0, 0);
                            
                        } else if (player[1] < 325) { //falling of the block
                            
                            image (marioImage[0][0][3], 0, 0);
                            
                        } else { //just standing there
                            
                            image (marioImage[0][0][0], 0, 0);
                            
                        }
                        
                    } else if (pipeMov[0]) { //going down a pipe means he isnt moving, just standing there
                        
                        image (marioImage[0][0][0], 0, 0);
                        
                    } else if (jump) { //if he is in the middle of a jump
                        
                        image (marioImage[0][0][4], 0, 0);
                        
                    } else if (abs(player[3]) > 0.1) { //falling from a non-jump
                        
                        image (marioImage[0][0][3], 0, 0);
                        
                    } else if (abs(player[2]) < 0.05 | (keys[88] & abs(player[2]) < 0.5)) { //standing still (basically)
                        
                        image (marioImage[0][0][0], 0, 0);
                        
                    } else { //running!
                        
                        //5 frames in sequence 2324
                        if (timer%24 < 6) {
                            
                            image (marioImage[0][0][1], 0, 0);
                            
                        } else if (timer % 24 < 12) {
                            
                            image (marioImage[0][0][2], 0, 0);
                            
                        } else if (timer%24 < 18) {
                            
                            image (marioImage[0][0][1], 0, 0);
                            
                        } else {
                            
                            image (marioImage[0][0][3], 0, 0);
                            
                        }
                        
                    }
                    
                }
            
            }
            
            popMatrix();
        
        }
        
        //draws all the blocks
        for (var i = 0; i < blocks.length; i ++) {
            
            pushMatrix();
            
            translate(0, blocks[i][3]);
            
            if (blocks[i][0] <= (-translatePos + 400) & blocks[i][0] >= (-translatePos - 25)) {
                
                if (levelNum === 3) {
                    
                    if (blocks[i][2] === 1) {
                        
                        image(blockImage[8][0], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 2) {
                        
                        image(blockImage[8][1], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 3) {
                        
                        image(blockImage[2][3][2], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 4) {
                        
                        image(blockImage[2][3][2], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 5) {
                        
                        image(blockImage[2][3][2], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 6) {
                        
                        image(blockImage[2][3][2], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 7) {
                        
                        image(blockImage[2][3][2], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 8) {
                        
                        image(blockImage[8][2], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 9) {
                        
                        if (frameCount%24 < 12) {
                            
                            image(blockImage[2][0][2], blocks[i][0], blocks[i][1]);
                            
                        } else if (frameCount%24 < 18) {
                            
                            image(blockImage[2][1][2], blocks[i][0], blocks[i][1]);
                            
                        } else {
                            
                            image(blockImage[2][2][2], blocks[i][0], blocks[i][1]);
                            
                        }
                        
                    }
                    
                } else {
                    
                    if (blocks[i][2] === 16) {
                        
                        var left = true;
                        for (var j = 0; j < blocks.length; j ++) {
                            
                            if (blocks[i][0] === (blocks[j][0] + 25) & blocks[i][1] === blocks[j][1] & blocks[i][2] === blocks[j][2]) {
                                
                                left = false;
                                
                            }
                            
                        }
                        var right = true;
                        for (var j = 0; j < blocks.length; j ++) {
                            
                            if (blocks[i][0] === (blocks[j][0] - 25) & blocks[i][1] === blocks[j][1] & blocks[i][2] === blocks[j][2]) {
                                
                                right = false;
                                
                            }
                            
                        }
                        if (left) {
                            
                            image(blockImage[5][blockType], blocks[i][0], blocks[i][1]);
                            
                        } else if (right) {
                            
                            image(blockImage[7][blockType], blocks[i][0], blocks[i][1]);
                            
                        } else {
                            
                            image(blockImage[6][blockType], blocks[i][0], blocks[i][1]);
                            
                        }
                        
                    } else if (blocks[i][2] === 1) {
                        
                        image(blockImage[0][blockType], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 2) {
                        
                        if (levelNum === 3) {
                            
                            image(blockImage[8][1], blocks[i][0], blocks[i][1]);
                            
                        } else {
                            
                            image(blockImage[1][blockType], blocks[i][0], blocks[i][1]);
                            
                        }
                        
                    } else if (blocks[i][2] === 3) {
                        
                        image(blockImage[2][3][blockType], blocks[i][0], blocks[i][1]);
                        
                    } else if (blocks[i][2] === 4 | (blocks[i][2] === 50 | blocks[i][2] === 60 | blocks[i][2] === 70 | blocks[i][2] === 80 | blocks[i][2] === 90)) {
                        
                        var topB = true;
                        
                        for (var k = 0; k < blocks.length; k ++) {
                            
                            if (blocks[k][1] === (blocks[i][1] - 25) & blocks[i][0] === blocks[k][0]) {
                                
                                topB = false;
                                
                            }
                            
                        }
                        
                        if (topB) {
                            
                            image(blockImage[3][blockType], blocks[i][0], blocks[i][1]);
                            
                        } else {
                            
                            image(blockImage[4][blockType], blocks[i][0], blocks[i][1]);
                            
                        }
                        
                    } else if (blocks[i][2] >= 5 & blocks[i][2] <= 9) {
                        
                        if (frameCount%24 < 12) {
                            
                            image(blockImage[2][0][blockType], blocks[i][0], blocks[i][1]);
                            
                        } else if (frameCount%24 < 18) {
                            
                            image(blockImage[2][1][blockType], blocks[i][0], blocks[i][1]);
                            
                        } else {
                            
                            image(blockImage[2][2][blockType], blocks[i][0], blocks[i][1]);
                            
                        }
                        
                    } else if (blocks[i][2] === 21) {
                        
                        image(blockImage[8][0], blocks[i][0], blocks[i][1]);
                        
                    }
                    
                }
            
            }
            popMatrix();
            
        }
        
        //draws the pipes
        for (var i = 0; i < pipes.length; i ++) {
            
            if (pipes[i][0] > (-translatePos - 51) & pipes[i][0] < (-translatePos + 401)) {
                
                if (pipes[i][2] >= 100) {
                    
                    if (pipes[i][2] === 100) { //facing up!
                        
                        var below = false;
                        var other1 = false;
                        var other2 = false;
                        
                        for (var j = 0; j < pipes.length; j ++) {
                            
                            if (pipes[i][1] === (pipes[j][1] + 25) & pipes[i][0] === pipes[j][0] & (pipes[i][2] === 100 | pipes[i][2][4] === 0)) {
                                
                                below = true;
                                
                            }
                            
                            if (pipes[i][0] === (pipes[j][0] + 25) & pipes[i][1] === pipes[j][1]) {
                                
                                other1 = true;
                                
                            }
                            
                            if (pipes[i][0] === (pipes[j][0] + 25) & pipes[i][1] === (pipes[j][1] + 25)) {
                                
                                other2 = true;
                                
                            }
                            
                        }
                        
                        if (other1) {
                            
                            image(pipeImage[4], pipes[i][0], pipes[i][1]);
                            
                        } else if (!other2) {
                        
                            //in the underworld of level 1, the vertical pipe just ends without a top part
                            if (below | (levelNum === 0 & lvlStage === 1)) {
                                
                                image(pipeImage[1], pipes[i][0], pipes[i][1]);
                                
                            } else {
                                
                                image(pipeImage[0], pipes[i][0], pipes[i][1]);
                                
                            }
                            
                        }
                        
                    } else if (pipes[i][2] === 102) { //facing left!
                        
                        var toLeft = false;
                        var other = false;
                        
                        for (var j = 0; j < pipes.length; j ++) {
                            
                            if (pipes[i][0] === (pipes[j][0] + 25) & pipes[i][1] === pipes[j][1] & (pipes[i][2] === 102 | pipes[i][2][4] === 2)) {
                                
                                toLeft = true;
                                
                            }
                            
                        }
                        
                        if (toLeft) {
                            
                            image(pipeImage[3], pipes[i][0], pipes[i][1]);
                            
                        } else {
                            
                            image(pipeImage[2], pipes[i][0], pipes[i][1]);
                            
                        }
                        
                    }
                    
                } else {
                    
                    if (pipes[i][2][4] === 0) { //facing up!
                        
                        var below = false;
                        
                        for (var j = 0; j < pipes.length; j ++) {
                            
                            if (pipes[i][1] === (pipes[j][1] + 25) & pipes[i][0] === pipes[j][0] & (pipes[i][2] === 100 | pipes[i][2][4] === 0)) {
                                
                                below = true;
                                
                            }
                            
                        }
                        
                        //in the underworld of level 1, the vertical pipe just ends without a top part
                        if (below | (levelNum === 0 & lvlStage === 1)) {
                            
                            image(pipeImage[1], pipes[i][0], pipes[i][1]);
                            
                        } else {
                            
                            image(pipeImage[0], pipes[i][0], pipes[i][1]);
                            
                        }
                        
                    } else if (pipes[i][2][4] === 2) { //facing left!
                        
                        var toLeft = false;
                        
                        for (var j = 0; j < pipes.length; j ++) {
                            
                            if (pipes[i][0] === (pipes[j][0] + 25) & pipes[i][1] === pipes[j][1] & (pipes[i][2] === 102 | pipes[i][2][4] === 2)) {
                                
                                toLeft = true;
                                
                            }
                            
                        }
                        
                        if (toLeft) {
                            
                            image(pipeImage[3], pipes[i][0], pipes[i][1]);
                            
                        } else {
                            
                            image(pipeImage[2], pipes[i][0], pipes[i][1]);
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
        if (player[1] >= 450) {
            
            dying = [true, -10, 1];
            
        }
    
        pushMatrix();
        
        translate (endX - 15, 50);
        
        scale(25/16);
        noStroke ();
        
        pushMatrix(); //separate part for the flag because moves
        
        translate(0, flagY); //moves the flag down at the end
        
        fill (252, 252, 252); //white part of the flag
        
        for (var a = 0; a < 17; a ++) { //draws the white layer of the flag
            
            rect (a, a + 15.5, 17 - a, 1.5);
            
        }
        
        fill (16, 148, 0); //draws the little logo on the flag
        rect (9, 18, 1, 5);
        rect (10, 21, 2, 2);
        rect (11, 22, 3, 2);
        rect (13, 21, 3, 2);
        rect (15, 18, 1, 5);
        rect (11, 20, 3, 1);
        rect (10, 17, 5, 1);
        rect (10, 18, 1, 1);
        rect (14, 18, 1, 1);
        rect (12, 18, 1, 2);
        
        popMatrix();
        
        fill (140, 214, 0); //draws the pole
        rect (17, 16, 2, 160);
        
        fill (0, 0, 0); //draws the ball outline
        rect (14, 10, 8, 4);
        rect (16, 8, 4, 8);
        rect (15, 9, 6, 6);
        
        fill (16, 148, 0); //ball inside
        rect (15, 10, 6, 4);
        rect (16, 9, 4, 6);
        
        fill (140, 214, 0); //ball shine
        rect (15, 10, 1, 2);
        rect (16, 9, 1, 1);
        
        popMatrix();
        
        //flag mario animation at the end of a level
        if (player[0] > (endX - 12.5)) {
            
            endLevel = true; //so that his movement is only manually contoled in this if statement
            player[2] = 0; //no x and y velocity
            player[3] = 0;
            
            if (player[1] < (300 - yInc)) { //if he hasn't made it to the bottom of the bottom of the flag pole
                
                player[1] += 3; //move mario down fairly quickly
                
                if (flagY < 137.5) {
                    
                    flagY += 2; //really quick
                    
                }
                
                player[0] = endX - 12;
                
            } else if (flagY < 137.5) { //then move the flag pole down
                
                flagY += 2; //really quick
                
            } else {
                
                flagY = 140.5;
                
                if (player[0] < (endX + 150)) { //moves forward until to the castle
                    
                    player[0] += 2; //slowly
                    
                }
                
                if (player[0] > (endX + 25) & player[1] < (325 - yInc)) { //if he is off the block but not on the ground
                    
                    player[1] += (player[1] - 290 + yInc)/10; //move him down, by how low he already is
                    
                } else if (player[0] > (endX + 50)) { //if he is past the block (well past it)
                    
                    player[1] = 325 - yInc; //reset his y values to exactly on the ground
                    
                }
                
            }
            
        } //end of flag animation
        
        if (dying[0]) {
            
            image (marioImage[0][0][5], player[0], player[1]);
        
        }
        
        popMatrix();
        
        if (timeLeft <= 0 & !endLevel & !dying[0]) {
            
            dying = [true, -10];
            powerups = [false, false, false];
            
        }
        
        //makes the time go down
        if (frameCount%24 === 0 & !endLevel) {
            
            if (timeLeft > 0) {
                
                timeLeft --;
                
            } else {
                
                timeLeft = 0;
                
            }
            
        } else if (endLevel & player[0] >= (endX + 150)) {
            
            if (timeLeft > 0) {
                
                timeLeft --;
                score += 50;
                
            } else {
                
                if (levelNum < (maps.length - 1)) {
                    
                    levelNum ++;
                    first = true;
                    endLevel = false;
                    playerReset = true;
                    timeLeft = 400;
                    savedScore = score;
                    translatePos = 0;
                    lvlStage = 0;
                    
                }
                
            }
            
        }
        
        if (recover > 0) { //if the timer is on for when mario just died
            
            recover --; //countdown on the timer
            
        }
        
        if (dying[0]) {
            
            dying[1] += 0.5;
            player[1] += dying[1];
            
            if (dying[1] > 0 & player[1] > 450) {
                
                if (dying[2] === 1) {
                    
                    powerups = [false, false, false];
                    
                }
                
                playerReset = true;
                first = true;
                timeLeft = 400;
                dying[0] = false;
                
                score = savedScore;
                
                //turns on the death screen
                death = [true, 150];
                
                //decreases number of lives (bc mario died)
                lives --;
            
            }
            
        }
        
        if (playerReset) { //executed at the VERY END when the player dies
            
            //resets time
            timeLeft = 400;
            
            //reset player values
            player = [50, 325, 0.01, 0, true, true, true, true];
            
            if (levelNum === 3) {
                
                player = [50, 125, 0.01, 0, true, true, true, true];
                
            }
            
            //translate to very left
            translatePos = 0;
            
            score = savedScore;
            
            first = true; //level resets
            
            invincible = 0;
            
            playerReset = false; //doesnt constantly kill him
            
        }
        
    }
    
    //all the text at the top
    txt("MARIO", 37.5, 25);
    scoreText = score.toString();
    for (var i = 0; i < (6 - scoreText.length); i ++) {
        
        txt("0", 37.5 + i*12.5, 37.5);
        
    }
    txt(scoreText, 37.5 + (6 - scoreText.length)*12.5, 37.5);
    
    if (coin >= 10) {
        
        txt("×" + coin, 150, 37.5);
        
    } else {
        
        txt("×0" + coin, 150, 37.5);
        
    }
    
    txt("WORLD", 225, 25);
    txt("1-"+(levelNum + 1), 237.5, 37.5);
    
    txt("TIME", 312.5, 25);
    
    if (!title & !death[0]) {
        
        timeLeftText = timeLeft.toString();
        for (var i = 0; i < (3 - timeLeftText.length); i ++) {
            
            txt("0", 325 + i*12.5, 37.5);
            
        }
        txt(timeLeftText, 325 + (3 - timeLeftText.length)*12.5, 37.5);
        
    }
    
    if (frameCount%24 < 12) {
        
        image(extra[0], 137.5, 37.5); //draws a coin
        
    } else if (frameCount%24 < 18) {
        
        image(extra[1], 137.5, 37.5); //draws a coin
        
    } else {
        
        image(extra[2], 137.5, 37.5); //draws a coin
        
    }
    
    /**
    //useful for placing enemies!
    
    if (mouseIsPressed) {
        
        fill(0, 0, 0);
        text("x: " + floor((mouseX - translatePos)/25)*25 + ", y: " + floor(mouseY/25)*25, 200, 200);
        
    }*/
    
    //the points text that appears when you earn points
    for (var i = 0; i < points.length; i ++) {
        
        if (points[i][4]) {
            
            pointsText(points[i][0], points[i][1], points[i][2]);
            
            points[i][1] -= 25/16;
            
            if (points[i][1] < (points[i][3] - 25)) {
                
                points[i][4] = false;
                
            }
        
        }
        
    }
    
    firstClick[keyCode] = false; //makes it false so that it is only one
    /*
    if (mouseIsPressed) {
        
        text(floor((mouseX - translatePos)/25)*25 + "\n" + floor(mouseY/25)*25, 150, 150);
        
    }
    */
};
