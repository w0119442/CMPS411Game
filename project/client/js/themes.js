	// theme selections
	var themeDiv = document.getElementById('themeDiv');
	var tankTheme = document.getElementById('tankTheme');
	
	var Img = {};
	Img.playerTop = new Image();
	Img.playerBase = new Image();
	Img.projectile = new Image();
	Img.map = new Image();
	Img.bgtile = new Image();
	
	var Snd = {};
	Snd.bgm = new Audio();
	Snd.bgm.loop = true;
	Snd.bgm.volume = 0.5;
	Snd.shoot = new Audio();
//	Snd.death = new Audio();
	
	// Set default theme to Tank 
	Img.playerTop.src = '/client/theme/Tank/playerTop.png';
	Img.playerBase.src = '/client/theme/Tank/playerBase.png';
	Img.projectile.src = '/client/theme/Tank/bullet.png';
	Img.map.src = '/client/theme/Tank/map.png';
	Img.bgtile.src = '/client/theme/Tank/bgtile.png';
	
	Snd.bgm.src = '/client/theme/Tank/bgm.mp3';
	Snd.bgm.play(); // play background music
	Snd.shoot.src = '/client/theme/Tank/bullet.mp3';
//	Snd.death.src = '/client/theme/Tank/death.mp3';
	
	var hpColorY = "#00FF99";
	var hpColorN = "#FF0000";
	var hpLine = "#000000";
	
	tankTheme.onclick = function() {
		setTheme("Tank");
	}
	bookTheme.onclick = function() {
		setTheme("Book");
	}
	spiderTheme.onclick = function() {
		setTheme("Spider");
	}
	ufoTheme.onclick = function() {
		setTheme("UFO");
	}	
	octopusTheme.onclick = function() {
		setTheme("Octopus");
	}		
	
	// Function that sets the theme based on the button clicked
	function setTheme(theme) {
		Img.playerTop.src = "/client/theme/" + theme + "/playerTop.png";
		Img.playerBase.src = "/client/theme/" + theme + "/playerBase.png";
		Img.projectile.src = "/client/theme/" + theme + "/bullet.png";
		Img.map.src = "/client/theme/" + theme + "/map.png";
		Img.bgtile.src = "/client/theme/" + theme + "/bgtile.png";
		Snd.bgm.src = "/client/theme/" + theme + "/bgm.mp3";
		Snd.shoot.src = "/client/theme/" + theme + "/bullet.mp3";
//		Snd.death.src = "/client/theme/" + theme + "/death.mp3";
		Snd.bgm.load();
		Snd.shoot.load();
//		Snd.death.load();
		Snd.bgm.play();
		
		switch(theme)
		{
			case "UFO":
				hpColorY = "#F7BE81";
				hpColorN = "#4B088A";
				hpLine = "#FFFFFF";
				break;
			case "Book":
				hpColorY = "#2EFEC8";
				hpColorN = "#B4045F";
				hpLine = "#0A0A2A";
				break;			
			case "Octopus":
				hpColorY = "#A9F5BC";
				hpColorN = "#DF013A";
				hpLine = "#86B404";
				break;					
			default:
			 	hpColorY = "#00FF99";
				hpColorN = "#FF0000";
				hpLine = "#000000";
		}
	}