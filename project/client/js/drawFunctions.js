	// Function for drawing player images (base and top)
	function drawPlayer(transX, transY, angle, pImage, pSize) {
		ctx.save();
		ctx.translate(transX, transY);
		ctx.rotate((angle + 90) * Math.PI/180);
		ctx.drawImage(pImage, -pSize/2, -pSize/2, pSize, pSize);
		ctx.restore();	
	}
	
	// Function for drawing the hp bar
	function drawHP(botX, botY, team, p) {
		var hpHeight = 7;
		var hpWidth = Math.floor(PLAYER_SIZE/HP);

		for(var j = 0; j < p.hp; j++) {
			if(p.team == team) {
				ctx.fillStyle = hpColorY;
			}
			else {
				ctx.fillStyle = hpColorN;
			}
			ctx.fillRect(botX + hpWidth * j, botY, hpWidth, hpHeight);
		}
		
		ctx.strokeStyle = hpLine;
		ctx.lineWidth = 1;
		ctx.strokeRect(botX, botY, HP * hpWidth, hpHeight);
	}
	
	function resizeFunction() {
		clientWidth = window.innerWidth;
		clientHeight = window.innerHeight;
		VIEW_WIDTH = Math.floor(clientWidth * .9 / BORDER_SIZE) * BORDER_SIZE;
		VIEW_HEIGHT = Math.floor(clientHeight * .9 / BORDER_SIZE) * BORDER_SIZE;
		ctx.canvas.width = VIEW_WIDTH;
		ctx.canvas.height = VIEW_HEIGHT;
		ctx.font = '30px Arial';
		var patrnBack = ctx.createPattern(Img.bgtile, "repeat");
		ctx.fillStyle = patrnBack;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}