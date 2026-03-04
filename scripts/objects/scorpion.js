MyGame.objects.Scorpion = function (spec, soundManager) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  let timePassed = 0;
  let alive = false;

  function update(elapsedTime) {
    spec.hitbox = {
      ymin: spec.center.y - spec.grid.size * .4,
      ymax: spec.center.y + spec.grid.size * .4,
      xmin: spec.center.x - spec.grid.size * .45 * .5,
      xmax: spec.center.x + spec.grid.size * .45 * 2.5
    }
    if (!alive) {
      timePassed += elapsedTime;
      if (timePassed > spec.spawnRate) {
        if (Math.random() < spec.spawnChance)
          spawn();
        else
          timePassed = 0;
      }
    }
    else {
      move(elapsedTime);
    }
  }

  function move(elapsedTime) {
    spec.center.x += spec.moveRate * elapsedTime;
    if (spec.center.x > spec.wall) {
      despawn();
    }
  }

  function spawn() {
    soundManager.play("soundFX/scorpion.wav", true);
    alive = true;
    spec.center = {
      x: 0,
      y: (Math.random() * (spec.grid.y - 15) * spec.grid.size + spec.offset + spec.grid.size)
    };
  }

  function despawn() {
    soundManager.clearSound("soundFX/scorpion.wav");
    alive = false;
    timePassed = 0;
    spec.center = {
      x: -500,
      y: -500
    }
  }

  let api = {
    update: update,
    despawn: despawn,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get center() { return spec.center; },
    get hitbox() { return spec.hitbox; },
    get subSize() { return spec.subSize; }
  };

  return api;
}
