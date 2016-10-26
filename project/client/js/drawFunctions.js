	// Function for drawing player images (base and top)
	function drawPlayer(transX, transY, angle, pImage, pSize) {
		ctx.save();
		ctx.translate(transX, transY);
		ctx.rotate((angle + 90) * Math.PI/180);
		ctx.drawImage(pImage, -pSize/2, -pSize/2, pSize, pSize);
		ctx.restore();	
	}
	
	// Function for drawing players as circle for big map
	function drawPlayers(isPlayer, playerX, playerY, pTeam) {
		var xCoord = 0;
		var yCoord = 0;
		var hpColorN = "#990012";
		var hpColorY = "#6CC417";
		var color = "#FFFFFF";
		
		var scaleX = (clientWidth - 2 * borderSize)/(WORLD_WIDTH * MAP_WRAP_NUMBER);
		var scaleY = (clientHeight - 2 * borderSize - divHeight)/(WORLD_HEIGHT * MAP_WRAP_NUMBER);
		
		xCoord = Math.floor(scaleX * (playerX + PLAYER_SIZE/2) + borderSize);
		yCoord = Math.floor(scaleY * (playerY + PLAYER_SIZE/2) + borderSize);
		
		if(team == pTeam) {
			color = hpColorY;
			cntTeam0++;
		}
		else {
			color = hpColorN;
			cntTeam1++;
		}
		
		ctx.beginPath();
		ctx.arc(xCoord, yCoord, radius, 0, 2*Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
		if(!isPlayer) {
			ctx.strokeStyle = color;
			ctx.stroke();
		}
		else {
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 2;
			ctx.stroke();
		}
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
	
	// Resize window for game
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
	
	// Resize window for big map
	function resizeWindow() {
		clientWidth = window.innerWidth - 2 * borderSize;
		clientHeight = window.innerHeight - 2 * borderSize - divHeight;
		ctx.canvas.width = clientWidth;
		ctx.canvas.height = clientHeight;
		playFit = Math.min(Math.floor(clientWidth/maxNumPlay), Math.floor(clientHeight/maxNumPlay));
		radius = Math.max(fixRadius, playFit);	
		ctx.font = '30px Arial';
	}
	
	// Function to draw big map
	function drawMap() {
		ctx.clearRect(0, 0, clientWidth, clientHeight);	
		ctx.fillStyle = "#E5E4E2";
		ctx.fillRect(0, 0, clientWidth, clientHeight);
		ctx.beginPath();
		ctx.lineWidth = borderSize;
		ctx.strokeStyle = "#000000";
		ctx.rect(0, 0, clientWidth, clientHeight);
		ctx.stroke();
	}