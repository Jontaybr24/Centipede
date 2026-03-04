MyGame.objects.Centipede = function (spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();
  let direction = { x: 1, y: 1, down: false };
  let target = null;

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;


  function move(elapsedTime) {
    // complecated statement that I don't understand anymore
    if (spec.nextSegment != null && spec.nextSegment != null && direction.x == spec.nextSegment.direction.x && Math.abs(spec.center.x - spec.nextSegment.center.x) > spec.gridSize) {
      spec.center.x = spec.nextSegment.center.x - direction.x * spec.gridSize;
      spec.center.y = spec.nextSegment.center.y;
    }
    else {
      let move = spec.center.x + (direction.x * spec.moveRate * elapsedTime);
      if (!direction.down && move > spec.clamp.left && move < spec.clamp.right) {
        spec.center.x = move;
        snapY();
      }
      else {
        if (spec.nextSegment == null || direction != spec.nextSegment.direction)
          moveDown(elapsedTime);
      }
    }
    updateHitbox();
  }

  function moveDown(elapsedTime) {
    // If we're not moving down already set movind down to true
    if (!direction.down) {
      direction.down = true;
      snapX();
      direction.x *= -1
      target = spec.center.y + (spec.gridSize * direction.y);
    }
    else {
      // if moving down, check to see if we've gone past the target
      if (direction.y == 1 && target < spec.center.y) {
        direction.down = false;
      }
      // if moving up, check to see if we've gone past the target
      else if (direction.y == -1 && target > spec.center.y) {
        direction.down = false;
      }
      // continue moving down
      else {
        // check to see if the next move will be outside the clamp
        let move = spec.center.y + (direction.y * spec.moveRate * elapsedTime);
        if (move > spec.clamp.up && move < spec.clamp.down) {
          spec.center.y = move;
        }
        // if it is outside the clamp We've hit a wall so we need to move up now
        else {
          direction.y *= -1;
          target = spec.center.y + (spec.gridSize * direction.y);
        }
      }
    }
  }

  function poisoned() {
    direction.y = 1;
    direction.down = true;
    snapX();
    direction.x *= -1
    target = spec.clamp.down + spec.gridSize * -.5;
  }

  function collision() {
    if (!direction.down) {
      direction.down = true;
      snapX();
      direction.x *= -1
      target = spec.center.y + (spec.gridSize * direction.y);
      if (spec.center.y < spec.gridSize * 14 + spec.clamp.up) {
        direction.y = 1;
      }
    }
  }

  function snapY() {
    let distance = (Math.floor((spec.center.y - spec.clamp.up) / spec.gridSize) + .5) * spec.gridSize
    spec.center.y = distance + spec.clamp.up;

  }

  function snapX() {
    let distance = (Math.floor((spec.center.x) / spec.gridSize) + .5) * spec.gridSize
    spec.center.x = distance;
  }

  function makeHead() {
    spec.nextSegment.setPrev(null);
    spec.nextSegment = null;
    setHead(spec);
  }

  function updateHitbox() {
    spec.hitbox = {
      ymin: spec.center.y - spec.gridSize * .40,
      ymax: spec.center.y + spec.gridSize * .40,
      xmin: spec.center.x - spec.gridSize * .45,
      xmax: spec.center.x + spec.gridSize * .45
    }
  }

  function setPrev(prev) {
    spec.prevSegment = prev;
  }

  function setHead(head) {
    spec.head = head;
    if (spec.prevSegment != null)
      spec.prevSegment.setHead(head);
  }

  function getCoords() {
    return {
      x: Math.floor((spec.center.x) / spec.gridSize),
      y: Math.floor((spec.center.y - spec.clamp.up - spec.gridSize) / spec.gridSize + 1),
    };
  }

  let api = {
    move: move,
    makeHead: makeHead,
    collision: collision,
    setPrev: setPrev,
    setHead: setHead,
    getCoords: getCoords,
    poisoned: poisoned,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get center() { return spec.center; },
    get nextSegment() { return spec.nextSegment; },
    get prevSegment() { return spec.prevSegment; },
    get head() { return spec.head; },
    get hitbox() { return spec.hitbox; },
    get direction() { return direction; },
    get col() { return col; },
    get index() { return spec.index; },
    get subSize() { return spec.subSize; }
  };

  return api;
}