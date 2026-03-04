// --------------------------------------------------------------
//
// Renders an animated model based on a spritesheet.
//
// --------------------------------------------------------------
MyGame.render.AnimatedModel = function (spec, graphics) {
    'use strict';

    let animationTime = 0;
    let subImageIndex = {
        x: spec.subIndex.x,
        y: spec.subIndex.y,
    };
    let colorIndex = { x: 0, y: 0 };
    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded

    //
    // Load he texture to use for the particle system loading and ready for rendering
    image.onload = function () {
        isReady = true;
    }
    image.src = spec.spriteSheet;

    //------------------------------------------------------------------
    //
    // Update the state of the animation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        animationTime += elapsedTime;
        //
        // Check to see if we should update the animation frame
        if (animationTime >= spec.spriteTime) {
            //
            // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame.
            animationTime -= spec.spriteTime;
            nextSprite();
        }
    }

    function nextSprite() {
        subImageIndex.y++;
        if (subImageIndex.y >= spec.spriteCount.y + spec.subIndex.y)
            subImageIndex.y = spec.subIndex.y;
        if (subImageIndex.y == spec.subIndex.y) {
            subImageIndex.x++;
            if (subImageIndex.x >= spec.spriteCount.x + spec.subIndex.x)
                subImageIndex.x = spec.subIndex.x;
        }
    }

    function newColor() {
        if (spec.subTexture.width == 8) {
            colorIndex.x += 14;
            if (colorIndex.x > 27) {
                colorIndex.x = 0;
                colorIndex.y += 11;
                if (colorIndex.y > 43)
                    colorIndex.y = 0
            }
        }
        else {
            colorIndex.x += 7;
            if (colorIndex.x > 13) {
                colorIndex.x = 0;
                colorIndex.y += 11;
                if (colorIndex.y > 43)
                    colorIndex.y = 0
            }

        }
    }

    function resetColor() {
        colorIndex = { x: 0, y: 0 };
    }

    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    function render(model) {
        if (isReady) {
            graphics.drawSubTexture(image, { x: subImageIndex.x + colorIndex.x, y: subImageIndex.y + colorIndex.y }, spec.subTexture, model.center, model.rotation, model.subSize);
        }
    }

    let api = {
        update: update,
        render: render,
        newColor: newColor,
        resetColor: resetColor,
    };

    return api;
};
