MyGame.objects.Lives = function (spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;
  let maxLives = spec.lives;
  let lives = maxLives;
	let colorIndex = { x: 0, y: 0 };

  function setLives(){
    lives = maxLives;
  }

  function loseLife(){
    lives--;
    return (lives <= 0);
  }

  function newColor() {
    colorIndex.x += 14;
    if (colorIndex.x > 27) {
      colorIndex.x = 0;
      colorIndex.y += 11;
      if (colorIndex.y > 43)
        colorIndex.y = 0
    }
  }

  function resetColor() {
    colorIndex = { x: 0, y: 0 };
  }

  let api = {
    loseLife: loseLife,
    setLives: setLives,
    newColor: newColor,
    resetColor: resetColor,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get lives() {return lives},
    get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
    get hitbox() { return spec.hitbox; },
    get subTexture() { return spec.subTexture; }
  };

  return api;
}
