MyGame.objects.Flea = function (spec, soundManager) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  let timePassed = 0;
  let alive = false;
  let target = 0;
  let mushroom = null;
  let health = 2;

  function update(elapsedTime) {
    mushroom = null;

    spec.hitbox = {
      ymin: spec.center.y - spec.grid.size * .40,
      ymax: spec.center.y + spec.grid.size * .40,
      xmin: spec.center.x - spec.grid.size * .45,
      xmax: spec.center.x + spec.grid.size * .45 * 2
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
    spec.center.y += spec.moveRate * elapsedTime;
    if (spec.center.y > target) {
      spawnMush();
      target = spec.center.y + spec.grid.size;
    }
    if (spec.center.y > spec.lowerBound) {
      despawn();
    }
  }

  function getMush() {
    return mushroom;
  }

  function takeHit() {
    health--;
    if (health == 0) {
      let center = spec.center;
      spawn();
      return {passed: true, center: center}
    }
    return {passed: false};
  }

  function spawn() {
    soundManager.play("soundFX/falling.wav");
    health = 2;
    alive = true;
    target = 0;
    spec.center = {
      x: (Math.random() * spec.grid.x * spec.grid.size),
      y: spec.spawnHeight
    };
  }

  function despawn() {
    alive = false;
    timePassed = 0;
    spec.center = {
      x: -500,
      y: -500
    }
  }

  function spawnMush() {
    if (Math.random() < spec.mushSpawnChance)
      mushroom = {
        x: Math.floor((spec.center.x) / spec.grid.size),
        y: Math.floor((spec.center.y - spec.spawnHeight - spec.grid.size) / spec.grid.size),
      };
  }

  let api = {
    update: update,
    getMush: getMush,
    takeHit: takeHit,
    despawn: despawn,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get center() { return spec.center; },
    get hitbox() { return spec.hitbox; },
    get subTexture() { return spec.subTexture; },
    get subSize() { return spec.subSize; }
  };

  return api;
}
