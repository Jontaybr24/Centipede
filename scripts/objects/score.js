MyGame.objects.Score = function (spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  let lifetime = 0;
  let colorIndex = { x: 0, y: 0 };

  function addSprite(value) {
    let index = 0;
    if (value.score == 600) {
      index = 1;
    }
    else if (value.score == 900)
      index = 2;
    spec.center = value.pos;
    lifetime = 0;
    spec.index = { x: 6, y: 0 + index };
  }

  function newColor() {
    colorIndex.x += 7;
    if (colorIndex.x > 13) {
      colorIndex.x = 0;
      colorIndex.y += 11;
      if (colorIndex.y > 43)
        colorIndex.y = 0
    }
  }

  function resetColor() {
    colorIndex = { x: 0, y: 0 };
  }

  function update(elapsedTime) {
    lifetime += elapsedTime;
    if (lifetime > spec.decay) {
      spec.center = { x: -500, y: -500 }
    }
  }

  let api = {
    addSprite: addSprite,
    newColor: newColor,
    resetColor: resetColor,
    update: update,
    get imageReady() { return imageReady; },
    get sprites() { return sprites; },
    get image() { return image; },
    get center() { return spec.center; },
    get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
    get hitbox() { return spec.hitbox; },
    get subTexture() { return spec.subTexture; }
  };

  return api;
}
