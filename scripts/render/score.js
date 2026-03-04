MyGame.render.Score = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {            
            graphics.drawSubTexture(
                spec.image,
                spec.index,
                spec.subTexture, 
                spec.center,
                0,
                { width: graphics.DATA.COORD_SIZE * 2, height: graphics.DATA.COORD_SIZE});
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));