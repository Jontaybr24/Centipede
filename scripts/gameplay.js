MyGame.screens['game-play'] = (function (game, objects, renderer, graphics, input, sounds) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();

    let paused = false;
    let NUM_SEGMENTS = null;

    let soundManager = sounds.manager();


    let myBoard = objects.Grid({
        GRID: { X: graphics.DATA.GRID.X, Y: graphics.DATA.GRID.Y, Size: graphics.DATA.COORD_SIZE },
        index: { x: 8, y: 0 },
        offset: {
            x: graphics.DATA.COORD_SIZE / 2,
            y: graphics.DATA.OFFSET.Y
        },
        subTexture: { width: 8, height: 8 },
        imageSrc: 'assets/spritesheet.png',
    });

    let myPlayer = objects.Player({
        center: { x: graphics.canvas.width / 2, y: (graphics.DATA.GRID.Y + 1) * graphics.DATA.COORD_SIZE },
        clamp: {
            left: graphics.DATA.COORD_SIZE / 2,
            right: graphics.canvas.width - graphics.DATA.COORD_SIZE / 2,
            up: graphics.DATA.COORD_SIZE * (graphics.DATA.GRID.Y - 4),
            down: graphics.DATA.COORD_SIZE * (graphics.DATA.GRID.Y + 1)
        },
        gridSize: graphics.DATA.COORD_SIZE,
        hitbox: { ymin: 0, ymax: 0, xmin: 0, xmax: 0, },
        imageSrc: 'assets/spritesheet.png',
        index: { x: 0, y: 10 },
        subTexture: { width: 8, height: 8 },
        moveRate: 500 / 1000 // pixels per millisecond
    });

    let lives = objects.Lives({
        lives: 3,
        imageSrc: 'assets/spritesheet.png',
        index: { x: 0, y: 10 },
        subTexture: { width: 8, height: 8 }
    });

    let myCentipede = null;

    function makeCentipede() {
        soundManager.clearSound("soundFX/centipede-move.wav");
        soundManager.play("soundFX/centipede-move.wav", true);
        myCentipede = [];
        for (let i = 0; i < NUM_SEGMENTS; i++) {
            let node = null;
            if (i == 0)
                node = null;
            else
                node = myCentipede[i - 1];
            myCentipede.push(
                objects.Centipede({
                    center: { x: graphics.DATA.COORD_SIZE * (20 - i), y: graphics.DATA.OFFSET.Y },
                    gridSize: graphics.DATA.COORD_SIZE,
                    clamp: {
                        left: graphics.DATA.COORD_SIZE / 2,
                        right: graphics.canvas.width - graphics.DATA.COORD_SIZE / 2,
                        up: graphics.DATA.OFFSET.Y - graphics.DATA.COORD_SIZE / 2,
                        down: graphics.DATA.COORD_SIZE * (graphics.DATA.GRID.Y + 1.2)
                    },
                    hitbox: { ymin: 0, ymax: 0, xmin: 0, xmax: 0, },
                    rotation: 1,
                    imageSrc: 'assets/spritesheet.png',
                    nextSegment: node,
                    prevSegment: null,
                    subSize: { width: graphics.DATA.COORD_SIZE, height: graphics.DATA.COORD_SIZE },
                    moveRate: 200 / 1000 // pixels per millisecond
                })
            );
            if (i > 0)
                myCentipede[i - 1].setPrev(myCentipede[i]);
        }
    }

    let centipedeHeadRender = renderer.AnimatedModel({
        spriteSheet: 'assets/spritesheet.png',
        spriteCount: { x: 4, y: 2 },
        subIndex: { x: 0, y: 0 },
        subTexture: { width: 8, height: 8 },
        spriteTime: 40,
    }, graphics);

    let centipedeBodyRender = renderer.AnimatedModel({
        spriteSheet: 'assets/spritesheet.png',
        spriteCount: { x: 4, y: 2 },
        subIndex: { x: 0, y: 2 },
        subTexture: { width: 8, height: 8 },
        spriteTime: 40,
    }, graphics);

    let fleaRender = renderer.AnimatedModel({
        spriteSheet: 'assets/spritesheet.png',
        spriteCount: { x: 2, y: 2 },
        subIndex: { x: 4, y: 4 },
        subTexture: { width: 16, height: 8 },
        spriteTime: 100,
    }, graphics);

    let myFlea = objects.Flea({
        grid: { size: graphics.DATA.COORD_SIZE, x: graphics.DATA.GRID.X },
        imageSrc: 'assets/spritesheet.png',
        center: { x: -500, y: -500 },
        spawnHeight: graphics.DATA.OFFSET.Y,
        lowerBound: graphics.DATA.COORD_SIZE * (graphics.DATA.GRID.Y + 1.2),
        subSize: { width: graphics.DATA.COORD_SIZE * 2, height: graphics.DATA.COORD_SIZE },
        mushSpawnChance: .25, // percentage chance to spawn a mushroom
        moveRate: 450 / 1000, // pixels per millisecond
        spawnRate: 5000, // time in ms for fleas to spawn
        spawnChance: .75
    }, soundManager);

    let spiderRender = renderer.AnimatedModel({
        spriteSheet: 'assets/spritesheet.png',
        spriteCount: { x: 4, y: 2 },
        subIndex: { x: 0, y: 4 },
        subTexture: { width: 16, height: 8 },
        spriteTime: 70,
    }, graphics);

    let mySpider = objects.Spider({
        gridSize: graphics.DATA.COORD_SIZE,
        imageSrc: 'assets/spritesheet.png',
        center: { x: -500, y: -500 },
        offset: graphics.DATA.OFFSET.Y,
        grid: { size: graphics.DATA.COORD_SIZE, y: graphics.DATA.GRID.Y },
        lowerBound: graphics.DATA.COORD_SIZE * (graphics.DATA.GRID.Y + 1.2),
        upperBound: graphics.DATA.COORD_SIZE * (graphics.DATA.GRID.Y - 3),
        wall: graphics.canvas.width,
        subSize: { width: graphics.DATA.COORD_SIZE * 2, height: graphics.DATA.COORD_SIZE },
        moveRate: 230 / 1000, // pixels per millisecond
        spawnRate: 2000, // time in ms for spider to spawn
        spawnChance: .5
    }, soundManager);

    let scorpionRender = renderer.AnimatedModel({
        spriteSheet: 'assets/spritesheet.png',
        spriteCount: { x: 4, y: 1 },
        subIndex: { x: 0, y: 7 },
        subTexture: { width: 16, height: 8 },
        spriteTime: 150,
    }, graphics);

    let myScorpion = objects.Scorpion({
        gridSize: graphics.DATA.COORD_SIZE,
        imageSrc: 'assets/spritesheet.png',
        center: { x: -500, y: -500 },
        offset: graphics.DATA.OFFSET.Y,
        grid: { size: graphics.DATA.COORD_SIZE, y: graphics.DATA.GRID.Y },
        wall: graphics.canvas.width,
        subSize: { width: graphics.DATA.COORD_SIZE * 2, height: graphics.DATA.COORD_SIZE },
        moveRate: 350 / 1000, // pixels per millisecond
        spawnRate: 5000, // time in ms for scorpion to spawn
        spawnChance: .75
    }, soundManager);

    let myLasers = objects.Laser({
        clamp: { up: graphics.DATA.COORD_SIZE / 2 + graphics.DATA.OFFSET.Y, },
        gridSize: graphics.DATA.COORD_SIZE,
        imageSrc: 'assets/spritesheet.png',
        index: { x: 1, y: 10 },
        subTexture: { width: 8, height: 8 },
        moveRate: 1200 / 1000, // pixels per millisecond
        shootDelay: 1000 / 6, // shots per second
    });

    let effectTime = 25;

    let myEffects = objects.Boom({
        subSize: { width: graphics.DATA.COORD_SIZE , height: graphics.DATA.COORD_SIZE },
        rotation: 0,
        decay: effectTime * 6,
    });

    let effectsRender = renderer.AnimatedModel({
        spriteSheet: 'assets/spritesheet.png',
        spriteCount: { x: 3, y: 2 },
        subIndex: { x: 8, y: 8 },
        subTexture: { width: 8, height: 8 },
        spriteTime: effectTime,
    }, graphics);

    let myScore = objects.Score({
        index:{x: 6, y: 0},
        center: {x: -500, y: -500},
        subTexture: { width: 16, height: 8 },
        imageSrc: 'assets/spritesheet.png',
        decay: 1000 // time in ms for sprite to show on screen
    });

    let gameCount = null;
    let controls = {};
    let highScores = {};
    let currentScore = 0;
    let previousScores = localStorage.getItem('MyGame.highScores');

    if (previousScores !== null) {
        highScores = JSON.parse(previousScores);
    }

    let spawnTime = 1000 // Time for player to respawn in ms
    let timeDead = 0;
    let playerDied = false;


    // Checks to see if two boxes have collided
    function checkCollision(box1, box2) {
        let collision = !(
            box2.xmin > box1.xmax ||
            box2.xmax < box1.xmin ||
            box2.ymin > box1.ymax ||
            box2.ymax < box1.ymin);
        return collision;
    }

    // Checks all the laser-centipede collisions
    function checkLaserCentipedeCollisions() {
        for (let laser in myLasers.lasers) {
            for (let segment in myCentipede) {
                if (checkCollision(myLasers.lasers[laser].hitbox, myCentipede[segment].hitbox)) {
                    if (myCentipede[segment].nextSegment == null)
                        currentScore += 100;
                    else
                        currentScore += 10;
                    myEffects.addSprite(myCentipede[segment].center);
                    myLasers.removeLaser(myLasers.lasers[laser].index);
                    myBoard.growMush(myCentipede[segment].getCoords());
                    myCentipede[segment]?.prevSegment?.makeHead();
                    soundManager.play("soundFX/damage2.wav");
                    myCentipede.splice(segment, 1);
                    break;
                }
            }
        }
    }

    // Checks all the laser-mushroom collisions
    function checkLaserMushCollisions() {
        for (let laser in myLasers.lasers) {
            for (let shroom in myBoard.mushrooms) {
                if (checkCollision(myLasers.lasers[laser].hitbox, myBoard.mushrooms[shroom].hitbox)) {
                    myLasers.removeLaser(myLasers.lasers[laser].index);
                    soundManager.play("soundFX/damage.wav");
                    if (myBoard.takeHit(myBoard.mushrooms[shroom].index))
                        currentScore++;
                    break;
                }
            }
        }
    }

    // Checks all the centipede-mushroom collisions
    function checkCentipedeMushCollisions() {
        for (let shroom in myBoard.mushrooms) {
            for (let segment in myCentipede) {
                if (checkCollision(myCentipede[segment].hitbox, myBoard.mushrooms[shroom].hitbox)) {
                    if (myBoard.mushrooms[shroom].poison == 0) {
                        myCentipede[segment].collision();
                    }
                    else {
                        myCentipede[segment].poisoned();
                    }
                }
            }
        }
    }

    // Check if a centipede has hit another centipede
    function checkCentipedeHeadCollisions() {
        for (let segment1 in myCentipede) {
            for (let segment2 in myCentipede) {
                if (myCentipede[segment1].head != myCentipede[segment2].head) {
                    if (checkCollision(myCentipede[segment1].hitbox, myCentipede[segment2].hitbox)) {
                        if (myCentipede[segment1].nextSegment == null && myCentipede[segment2].nextSegment == null) {
                            myCentipede[segment1].collision();
                        }
                        else {
                            if (myCentipede[segment1].nextSegment == null)
                                myCentipede[segment1].collision();
                            if (myCentipede[segment2].nextSegment == null)
                                myCentipede[segment2].collision();
                        }
                    }
                }
            }
        }
    }

    // Check if the player has hit a centipede
    function checkPlayerCentipedeCollisions() {
        for (let segment in myCentipede) {
            if (checkCollision(myCentipede[segment].hitbox, myPlayer.hitbox)) {
                playerHit();
                break;
            }
        }
    }

    // check if the player has hit a mushroom
    function checkMushPlayerCollisions() {
        for (let shroom in myBoard.mushrooms) {
            if (checkCollision(myPlayer.hitbox, myBoard.mushrooms[shroom].hitbox)) {
                myPlayer.pathBlocked(myBoard.mushrooms[shroom].hitbox);
            }
        }
    }

    // check if the laser hits a flea
    function checkLaserFleaCollision() {
        for (let laser in myLasers.lasers) {
            if (checkCollision(myFlea.hitbox, myLasers.lasers[laser].hitbox)) {
                let result = myFlea.takeHit();
                if (result.passed) {
                    currentScore += 200;
                    soundManager.play("soundFX/damage2.wav");
                    myEffects.addSprite(result.center);
                }
                myLasers.removeLaser(myLasers.lasers[laser].index);
                break;
            }
        }
    }

    // check if the laser hits a flea
    function checkLaserScorpionCollision() {
        for (let laser in myLasers.lasers) {
            if (checkCollision(myScorpion.hitbox, myLasers.lasers[laser].hitbox)) {
                myEffects.addSprite(myScorpion.center);
                myScorpion.despawn();
                myLasers.removeLaser(myLasers.lasers[laser].index);
                soundManager.play("soundFX/damage2.wav");
                currentScore += 1000;
                break;
            }
        }
    }

    function checkPlayerFleaCollision() {
        if (checkCollision(myFlea.hitbox, myPlayer.hitbox)) {
            playerHit();
        }
    }

    // check if the laser hits a flea
    function checkLaserSpiderCollision() {
        for (let laser in myLasers.lasers) {
            if (checkCollision(mySpider.hitbox, myLasers.lasers[laser].hitbox)) {
                myEffects.addSprite(mySpider.center);
                let value = mySpider.despawn(myPlayer.center);
                myScore.addSprite(value);
                currentScore += value.score;
                myLasers.removeLaser(myLasers.lasers[laser].index);
                soundManager.play("soundFX/damage2.wav");
                break;
            }
        }
    }

    function checkPlayerSpiderCollision() {
        if (checkCollision(mySpider.hitbox, myPlayer.hitbox)) {
            playerHit();
        }
    }

    // check if the scorpion needs to poison a mushroom
    function checkMushScorpionCollisions() {
        for (let shroom in myBoard.mushrooms) {
            if (checkCollision(myScorpion.hitbox, myBoard.mushrooms[shroom].hitbox)) {
                myBoard.poison(myBoard.mushrooms[shroom].index);
            }
        }
    }

    // check if the spider needs to poison a mushroom
    function checkMushSpiderCollisions() {
        for (let shroom in myBoard.mushrooms) {
            if (checkCollision(mySpider.hitbox, myBoard.mushrooms[shroom].hitbox)) {
                myBoard.takeHit(myBoard.mushrooms[shroom].index);
            }
        }
    }

    function checkAllColisions() {
        // Check all the possible collisions
        checkLaserCentipedeCollisions();
        checkLaserMushCollisions();
        checkCentipedeMushCollisions();
        //checkCentipedeHeadCollisions();
        checkPlayerCentipedeCollisions();
        checkMushPlayerCollisions();
        checkLaserFleaCollision();
        checkPlayerFleaCollision();
        checkMushScorpionCollisions();
        checkLaserScorpionCollision();
        checkPlayerSpiderCollision();
        checkLaserSpiderCollision();
        checkMushSpiderCollisions();
    }

    function playerHit() {
        soundManager.play("soundFX/game-over.wav");
        if (lives.loseLife()) {
            endGame();
        }
        else {
            playerDied = true;
            myPlayer.die();
        }
    }

    function checkWin() {
        if (myCentipede.length == 0) {
            NUM_SEGMENTS++;
            lives.setLives();
            makeCentipede();
            myPlayer.newColor();
            myLasers.newColor();
            myBoard.newColor();
            lives.newColor();
            centipedeBodyRender.newColor();
            centipedeHeadRender.newColor();
            scorpionRender.newColor();
            spiderRender.newColor();
            fleaRender.newColor();
            myScore.newColor();
        }
    }

    function hideMenu() {
        paused = false;
        document.getElementById('pause-menu').style.display = "none";
        soundManager.playAll();
    }
    function showMenu() {
        paused = true;
        document.getElementById('pause-menu').style.display = "block";
        soundManager.pauseAll();
    }

    function hideDeathMenu() {
        document.getElementById('death-menu').style.display = "none";
    }
    function showDeathMenu() {
        document.getElementById('death-menu').style.display = "block";
        soundManager.clearAll();
    }

    function startGame() {
        hideMenu();
        hideDeathMenu();
        currentScore = 0;
        NUM_SEGMENTS = 8;
        timeDead = 100000;
        controls = JSON.parse(localStorage.getItem('MyGame.controls'));
        gameCount = JSON.parse(localStorage.getItem('gameCount'));
        if (gameCount == null)
            gameCount = 0;
        localStorage['gameCount'] = ++gameCount;
        clearBoard();
        myBoard.genLevel(30);
        myBoard.resetColor();
        myLasers.resetColor();
        myPlayer.resetColor();
        lives.resetColor();
        fleaRender.resetColor();
        centipedeBodyRender.resetColor();
        centipedeHeadRender.resetColor();
        scorpionRender.resetColor();
        spiderRender.resetColor();
        effectsRender.resetColor();
        myScore.resetColor();
        /* test shrooms
        myBoard.growMush({x:18, y:0})
        myBoard.growMush({x:22, y:0})
        myBoard.poison({x:0, y:22})
        */
    }

    function clearBoard(elapsedTime) {
        if (timeDead > spawnTime) {
            soundManager.playAll();
            myBoard.regrow();
            makeCentipede();
            myLasers.clearAll();
            myPlayer.spawn();
            myFlea.despawn();
            myScorpion.despawn();
            mySpider.despawn();
            playerDied = false;
            timeDead = 0;
        }
        else {
            soundManager.pauseAll();
            timeDead += elapsedTime;
        }
    }

    function endGame() {
        showDeathMenu();
        paused = true;

        highScores[gameCount] = currentScore;
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);

    }

    function setControls() {
        gameCount = parseInt(localStorage.getItem('gameCount'));
        myKeyboard.clear();
        myKeyboard.register(controls.down, myPlayer.moveDown);
        myKeyboard.register(controls.left, myPlayer.moveLeft);
        myKeyboard.register(controls.right, myPlayer.moveRight);
        myKeyboard.register(controls.up, myPlayer.moveUp);
        myKeyboard.register(controls.fire, function () {
            if (myLasers.addLaser(myPlayer.center))
                soundManager.play("soundFX/laser.mp3");
        })
        myKeyboard.register('Escape', function () { showMenu(); })
        myKeyboard.register('f', function () { makeCentipede(); })
    }


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        if (playerDied) {
            clearBoard(elapsedTime);
        }
        else {
            for (var segment in myCentipede) {
                myCentipede[segment]?.move(elapsedTime)
            }

            centipedeHeadRender.update(elapsedTime);
            centipedeBodyRender.update(elapsedTime);
            fleaRender.update(elapsedTime);
            spiderRender.update(elapsedTime);
            scorpionRender.update(elapsedTime);

            effectsRender.update(elapsedTime);


            myLasers.update(elapsedTime);
            myPlayer.update();
            myFlea.update(elapsedTime);
            myScorpion.update(elapsedTime);
            mySpider.update(elapsedTime);
            myEffects.update(elapsedTime);
            myScore.update(elapsedTime);

            let result = myFlea.getMush();
            if (result != null) {
                myBoard.growMush(result);
            }

            checkAllColisions();

            document.getElementById('score-text').innerHTML = "Score: " + currentScore;

            checkWin();
        }

    }

    function render() {
        graphics.clear();

        renderer.Grid.render(myBoard);
        renderer.Player.render(myPlayer);
        renderer.Laser.render(myLasers);
        renderer.Lives.render(lives);
        renderer.Score.render(myScore);
        fleaRender.render(myFlea);
        spiderRender.render(mySpider);
        scorpionRender.render(myScorpion);
        for (var segment in myCentipede) {
            if (myCentipede[segment].nextSegment == null) {
                centipedeHeadRender.render(myCentipede[segment]);
            }
            else {
                centipedeBodyRender.render(myCentipede[segment]);
            }
        }        
        for (let effect in myEffects.sprites) {
            effectsRender.render(myEffects.sprites[effect]);
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;


        if (!paused) {
            update(elapsedTime);
            processInput(elapsedTime);
        }
        render();

        requestAnimationFrame(gameLoop);
    }

    function initialize() {

        document.getElementById('id-pause-back').addEventListener(
            'click',
            function () {
                game.showScreen('main-menu');
                soundManager.clearAll();
            });
        document.getElementById('id-pause-back').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-resume').addEventListener(
            'click',
            function () { hideMenu(); });
        document.getElementById('id-resume').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });

        document.getElementById('id-death-back').addEventListener(
            'click',
            function () {
                game.showScreen('main-menu');
                soundManager.clearAll();
            });
        document.getElementById('id-death-back').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-retry').addEventListener(
            'click',
            function () { startGame(); });
        document.getElementById('id-retry').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
    }

    function run() {
        lastTimeStamp = performance.now();
        startGame();
        setControls();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.sounds));