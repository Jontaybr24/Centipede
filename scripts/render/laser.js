MyGame.render.Laser = (function (graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {
            for (let laser in spec.lasers) {
                graphics.drawSubTexture(
                    spec.image,
                    spec.index,
                    spec.subTexture,
                    spec.lasers[laser].center,
                    0,
                    { width: graphics.DATA.COORD_SIZE, height: graphics.DATA.COORD_SIZE });
            }
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));