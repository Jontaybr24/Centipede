MyGame.screens['about'] = (function (game, sounds) {
    'use strict';
    let soundManager = sounds.manager();

    function initialize() {
        document.getElementById('id-about-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('id-about-back').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.sounds));
