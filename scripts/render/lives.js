MyGame.render.Lives = (function (graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {
            for (let i = 0; i < spec.lives; i++) {
                graphics.drawSubTexture(
                    spec.image,
                    spec.index,
                    spec.subTexture,
                    {x: graphics.DATA.COORD_SIZE * (10 + i / 2), y:graphics.DATA.COORD_SIZE * .5},
                    0,
                    { width: graphics.DATA.COORD_SIZE / 2, height: graphics.DATA.COORD_SIZE / 2 });
            }
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));