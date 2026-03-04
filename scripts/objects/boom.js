MyGame.objects.Boom = function (spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  let sprites = [];
  let colorIndex = { x: 0, y: 0 };

  function addSprite(pos) {
    sprites.push({
      center: pos,
      lifetime: 0,
      subSize: spec.subSize,
      rotation: 0,
    })
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

  function update(elapsedTime){
    for(let effect in sprites){
      sprites[effect].lifetime += elapsedTime;
      if(sprites[effect].lifetime > spec.decay){
        sprites.splice(effect, 1);
      }
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
    get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
    get hitbox() { return spec.hitbox; },
    get subTexture() { return spec.subTexture; }
  };

  return api;
}
