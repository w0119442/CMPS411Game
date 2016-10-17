	var soundOn = true;
	
	muteSound.onclick = function() {
		toggleSound();
	}
	
	function toggleSound() {
		if(soundOn) {
			soundOn = false;
			Snd.bgm.muted = true;
			Snd.shoot.muted = true;
			Snd.death.muted = true;
			soundImage.src = "/client/img/soundOff.png";
		}
		else {
			soundOn = true;
			Snd.bgm.muted = false;
			Snd.shoot.muted = false;
			Snd.death.muted = false;
			soundImage.src = "/client/img/soundOn.png";
		}
	}