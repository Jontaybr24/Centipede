MyGame.objects.Laser = function (spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  let lasers = [];
  let timeSinceShot = 0;
  let laserCount = 0
  let colorIndex = { x: 0, y: 0 };

  function update(elapsedTime) {
    timeSinceShot += elapsedTime;
    for (let laser in lasers) {
      lasers[laser].center.y -= spec.moveRate * elapsedTime;
      if (lasers[laser].center.y < spec.clamp.up) {
        removeLaser(lasers[laser].index)
      }
    }
    updateHitbox();
  }

  function updateHitbox() {
    for (let laser in lasers) {
      lasers[laser].hitbox.ymin = lasers[laser].center.y - spec.gridSize / 2;
      lasers[laser].hitbox.ymax = lasers[laser].center.y - spec.gridSize / 2;
    }
  }

  function addLaser(point) {
    if (timeSinceShot > spec.shootDelay) {
      lasers.push({
        index: laserCount,
        center: {
          x: point.x,
          y: point.y
        },
        hitbox: {
          xmin: point.x - spec.gridSize / 4, xmax: point.x + spec.gridSize / 4,
          ymin: point.y + spec.gridSize / 2, ymax: point.y - spec.gridSize / 2,
        }
      });
      laserCount++;
      timeSinceShot = 0;
      return true;
    }
    return false;
  }

  function removeLaser(index) {
    for (let laser in lasers) {
      if (lasers[laser].index == index) {
        lasers.splice(laser, 1);
      }
    }
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

  function clearAll() {
    lasers = [];
  }

  let api = {
    update: update,
    clearAll: clearAll,
    addLaser: addLaser,
    newColor: newColor,
    resetColor: resetColor,
    removeLaser: removeLaser,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get lasers() { return lasers; },
    get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
    get hitbox() { return spec.hitbox; },
    get subTexture() { return spec.subTexture; }
  };

  return api;
}