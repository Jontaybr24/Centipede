MyGame.render.Centipede = (function (graphics) {
    'use strict';

    function render(spec) {
        if (spec?.imageReady) {
            graphics.drawTexture(
                spec.image,
                spec.center,
                0,
                { width: graphics.DATA.COORD_SIZE, height: graphics.DATA.COORD_SIZE });
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));