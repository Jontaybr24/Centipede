MyGame.render.Grid = (function (graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {
            for (let shroom in spec.mushrooms) {
                graphics.drawSubTexture(
                    spec.mushImage,
                    {
                        x: spec.index.x + spec.mushrooms[shroom].state,
                        y: spec.index.y + spec.mushrooms[shroom].poison
                    },
                    spec.subTexture,
                    spec.mushrooms[shroom].center,
                    0,
                    { width: graphics.DATA.COORD_SIZE, height: graphics.DATA.COORD_SIZE });
            }
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));