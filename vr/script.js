 AFRAME.registerComponent('timer', {
    init: function() {
        let time = 900;
		const camera = player.querySelector('[camera]');
		const timeUpdatedEvent = new Event('newTime');
        setInterval(() => {
            score.setAttribute('text', 'value', time);
            if (time <= 0) {
                player.setAttribute('position', '0 0 27.5');
				camera.components['look-controls'].pitchObject.rotation.x = 0;
				camera.components['look-controls'].yawObject.rotation.y = 0;
                player.components['movement-controls'].updateNavLocation();
                time = 900;
            }
            time--;
        }, 1000);
    }
});