MyGame.screens['high-scores'] = (function (game, sounds) {
    'use strict';
    let soundManager = sounds.manager();

    function report() {
        let htmlNode = document.getElementById('scores');
        let scores = [];

        let highScores = {};
        let previousScores = localStorage.getItem('MyGame.highScores');

        if (previousScores !== null) {
            highScores = JSON.parse(previousScores);
        }

        for (let key in highScores) {
            scores.push(highScores[key]);
        }

        scores.sort((a, b) => b - a);

        htmlNode.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            if (scores[i])
                htmlNode.innerHTML += scores[i] + "<br>";
            else
                htmlNode.innerHTML += 0 + "<br>";

        }


    }

    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('id-high-scores-back').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });

    }

    function run() {
        report();
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.sounds));
