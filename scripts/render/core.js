MyGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

    let COORD = canvas.width;
    let GRID_X = 35;
    let GRID_Y = 20;
    let COORD_SIZE = COORD / GRID_X;

    let DATA = {
        COORD: {
            X: COORD,
            Y: canvas.height},
        GRID: {
            X: GRID_X,
            Y: GRID_Y
        },
        COORD_SIZE: COORD_SIZE,
        OFFSET: {
            X: COORD_SIZE * .5,
            Y: COORD_SIZE * 5
        }
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawSubTexture(image, index, subTexture, center, rotation, size) {
        context.save();
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        //
        // Pick the selected sprite from the sprite sheet to render
        context.drawImage(
            image,
            subTexture.width * index.x, subTexture.height * index.y,      // Which sub-texture to pick out
            subTexture.width, subTexture.height,   // The size of the sub-texture
            center.x - size.height / 2,           // Where to draw the sub-texture
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        get DATA() { return DATA; },
        clear: clear,
        drawTexture: drawTexture,
        drawSubTexture: drawSubTexture,
    };

    return api;
}());
