MyGame.objects.Spider = function (spec, soundManager) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  let timePassed = 0;
  let dirChange = 500; // time in ms till direction change
  let alive = false;
  let dir = {
    y: -1,
    x: 1
  }

  function update(elapsedTime) {
    timePassed += elapsedTime;
    spec.hitbox = {
      ymin: spec.center.y - spec.grid.size * .4,
      ymax: spec.center.y + spec.grid.size * .4,
      xmin: spec.center.x - spec.grid.size * .45 * .5,
      xmax: spec.center.x + spec.grid.size * .45 * 2.5
    }
    if (!alive) {
      if (timePassed > spec.spawnRate) {
        if (Math.random() < spec.spawnChance)
          spawn();
        else
          timePassed = 0;
      }
    }
    else {
      if (timePassed > dirChange) {
        if (Math.random() < spec.spawnChance) {
          dir.y = Math.floor(Math.random() * 3) - 1;
          dir.x = Math.round(Math.random());
          if (dir.y == 0)
            dir.y--;
        }
        else
          timePassed = 0;
      }
      move(elapsedTime);
    }
  }

  function move(elapsedTime) {
    spec.center.x += spec.moveRate * elapsedTime * dir.x;
    spec.center.y += spec.moveRate * elapsedTime * dir.y;
    if (dir.y == -1 && spec.center.y < spec.upperBound || dir.y == 1 && spec.center.y > spec.lowerBound)
      dir.y *= -1;
    if (spec.center.x > spec.wall) {
      despawn();
    }
  }

  function spawn() {
    soundManager.play("soundFX/spider.wav", true);
    alive = true;
    spec.center = {
      x: 0,
      y: ((spec.grid.y - 6) * spec.grid.size + spec.offset + spec.grid.size)
    };
  }

  function despawn(player) {
    let res = 300;
    let pos = spec.center;
    if (player) {
      let distance = Math.abs(player.y - spec.center.y);
      if (distance < 50)
        res = 900;
      else if (distance < 100)
        res = 600
    }
    soundManager.clearSound("soundFX/spider.wav");
    alive = false;
    timePassed = 0;
    spec.center = {
      x: -500,
      y: -500
    }
    return { score: res, pos: pos }
  }

  let api = {
    update: update,
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
