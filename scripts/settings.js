MyGame.screens['settings'] = (function (game, sounds) {
    'use strict';
    let soundManager = sounds.manager();

    let controls = {}
    let savedControls = localStorage.getItem('MyGame.controls');

    if (savedControls != null) {
        controls = JSON.parse(savedControls);
    }
    else {
        controls = {
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight',
            fire: ' ',
        }
    }
    let node = document.getElementById('move-up');
    if (controls.up == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = controls.up;
    node = document.getElementById('move-down');
    if (controls.down == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = controls.down;
    node = document.getElementById('move-left');
    if (controls.left == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = controls.left;
    node = document.getElementById('move-right');
    if (controls.right == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = controls.right;
    node = document.getElementById('fire');
    if (controls.fire == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = controls.fire;

    function setControl(id, key) {
        if (key != 'Escape') {
            let node = document.getElementById(id);
            if (key == ' ')
                node.innerHTML = 'Space';
            else
                node.innerHTML = key;
            switch (id) {
                case 'move-right':
                    controls.right = key;
                    break;
                case 'move-left':
                    controls.left = key;
                    break;
                case 'move-up':
                    controls.up = key;
                    break;
                case 'move-down':
                    controls.down = key;
                    break;
                case 'move-fire':
                    controls.fire = key;
                    break;
            }
            localStorage['MyGame.controls'] = JSON.stringify(controls);
        }
    }

    function keyPress(e) {
        let active = document.getElementsByClassName('selected');
        if (active.length == 1)
            setControl(active[0].id, e.key);
        deselect();
    }

    function select(id) {
        deselect();
        window.addEventListener('keyup', keyPress);
        let node = document.getElementById(id);
        node.classList.add('selected');
    }

    function deselect() {
        window.removeEventListener('keyup', keyPress);
        let active = document.getElementsByClassName('selected');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('selected');
        }
    }

    localStorage['MyGame.controls'] = JSON.stringify(controls);

    function initialize() {

        document.getElementById('id-settings-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('up-row').addEventListener(
            'click',
            function () { select('move-up'); });
        document.getElementById('down-row').addEventListener(
            'click',
            function () { select('move-down'); });
        document.getElementById('left-row').addEventListener(
            'click',
            function () { select('move-left'); });
        document.getElementById('right-row').addEventListener(
            'click',
            function () { select('move-right'); });
        document.getElementById('fire-row').addEventListener(
            'click',
            function () { select('fire'); });


        document.getElementById('up-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('down-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('right-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('left-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('fire-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-settings-back').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
    }

    function run() {
        deselect();
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.sounds));