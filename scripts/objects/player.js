MyGame.objects.Player = function (spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();
  let moved = false;
  let colorIndex = { x: 0, y: 0 };
  const spawnpoint = spec.center;
  let block = {
    left: spec.clamp.left,
    up: spec.clamp.up,
    down: spec.clamp.down,
    right: spec.clamp.right,
  }

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  function moveLeft(elapsedTime) {
    let move = spec.center.x - (spec.moveRate * elapsedTime);
    if (move > spec.clamp.left) {
      if (block == null || !(spec.hitbox.xmin < block.xmax && spec.hitbox.xmin > block.xmin))
        spec.center.x = move;
    }
    else {
      spec.center.x = spec.clamp.left;
    }
    moved = true;
  }

  function moveRight(elapsedTime) {
    let move = spec.center.x + (spec.moveRate * elapsedTime);
    if (move < spec.clamp.right) {
      if (block == null || !(spec.hitbox.xmax > block.xmin && spec.hitbox.xmax < block.xmax))
        spec.center.x = move;
    }
    else {
      spec.center.x = spec.clamp.right;
    }
    moved = true;
  }

  function moveUp(elapsedTime) {
    let move = spec.center.y - (spec.moveRate * elapsedTime);
    if (move > spec.clamp.up) {
      if (block == null || !(spec.hitbox.ymin > block.ymin && spec.hitbox.ymin < block.ymax))
        spec.center.y = move;
    }
    else {
      spec.center.y = spec.clamp.up;
    }
    moved = true;
  }

  function moveDown(elapsedTime) {
    let move = spec.center.y + (spec.moveRate * elapsedTime);
    if (move < spec.clamp.down) {
      if (block == null || !(spec.hitbox.ymax > block.ymin && spec.hitbox.ymax < block.ymax))
        spec.center.y = move;
    }
    else {
      spec.center.y = spec.clamp.down;
    }
    moved = true;
  }

  function update() {
    spec.hitbox = {
      ymin: spec.center.y - spec.gridSize * .5,
      ymax: spec.center.y + spec.gridSize * .5,
      xmin: spec.center.x - spec.gridSize * .4,
      xmax: spec.center.x + spec.gridSize * .4
    }
    block = null;
  }

  function die() {
    spec.center = {
      x: -100,
      y: -100
    }
  }

  function spawn() {
    spec.center = {
      x: spawnpoint.x,
      y: spawnpoint.y
    };
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

  function pathBlocked(box) {
    block = box;
  }

  let api = {
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveUp: moveUp,
    moveDown: moveDown,
    spawn: spawn,
    update: update,
    newColor: newColor,
    resetColor: resetColor,
    die: die,
    pathBlocked: pathBlocked,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get hitbox() { return spec.hitbox; },
    get center() { return spec.center; },
    get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
    get spawnpoint() { return spec.spawnpoint; },
    get subTexture() { return spec.subTexture; }
  };

  return api;
}
