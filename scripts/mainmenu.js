MyGame.screens['main-menu'] = (function (game, sounds) {
    'use strict';
    let soundManager = sounds.manager();

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function () { game.showScreen('game-play'); });

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function () { game.showScreen('high-scores'); });

        document.getElementById('id-settings').addEventListener(
            'click',
            function () { game.showScreen('settings'); });

        document.getElementById('id-about').addEventListener(
            'click',
            function () { game.showScreen('about'); });
        document.getElementById('id-new-game').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-high-scores').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-settings').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-about').addEventListener(
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
