MyGame.game = (function(screens) {
    'use strict';

    // Change the screen to a new active screen
    function showScreen(id){
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }

        screens[id].run();

        document.getElementById(id).classList.add('active');
    }

    // This perfoms one time function initialization
    function initialize() {
        let screen = null;
        for (screen in screens){
            if(screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }
        showScreen('main-menu');
    }

    return {
        initialize: initialize,
        showScreen: showScreen
    };

}(MyGame.screens));