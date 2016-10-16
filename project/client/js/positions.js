	var PLAYER_LIST = {};
	var socket = io();
	
	var clientId = null;
	
	socket.on('init',function(data) {
		if(data.selfId) {
			clientId = data.selfId;
		}
	});
	
	var pCenterX = 0.0;
	var pCenterY = 0.0;
	var pOffsetX = 0.0;
	var pOffsetY = 0.0;
	
	socket.on('newPositions',function(data) {
		console.log(data);
		ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
		var patrnBack = ctx.createPattern(Img.bgtile, "repeat");
		ctx.fillStyle = patrnBack;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
		var playerTeam = data.player[clientId].team;
		var playerX = data.player[clientId].x;
		var playerY = data.player[clientId].y;
		var xPosImage = 0.0;
		var yPosImage = 0.0;
		var clipX = pCenterX - VIEW_WIDTH/2;
		var clipY = pCenterY - VIEW_HEIGHT/2;
		
		pCenterX = playerX + PLAYER_SIZE/2;
		pCenterY = playerY + PLAYER_SIZE/2;				
		pOffsetX = VIEW_WIDTH/2;
		pOffsetY = VIEW_HEIGHT/2;
		
		if(pCenterX  < VIEW_WIDTH/2) {
			clipX = 0;
			xPosImage = Math.min(BORDER_SIZE, Math.abs(VIEW_WIDTH/2 - pCenterX));
			pOffsetX = pCenterX + xPosImage;
		}
		else if(pCenterX  > WORLD_WIDTH * MAP_WRAP_NUMBER - VIEW_WIDTH/2) {
			var borderSpot = WORLD_WIDTH * MAP_WRAP_NUMBER - VIEW_WIDTH/2;
			clipX = WORLD_WIDTH * MAP_WRAP_NUMBER - VIEW_WIDTH + Math.min(BORDER_SIZE, Math.abs(borderSpot - pCenterX));
			pOffsetX = VIEW_WIDTH - (WORLD_WIDTH * MAP_WRAP_NUMBER - pCenterX) - Math.min(BORDER_SIZE, Math.abs(borderSpot - pCenterX));
			xPosImage = 0;
		}
		
		if(pCenterY  < VIEW_HEIGHT/2) {
			clipY = 0;
			yPosImage = Math.min(32, Math.abs(VIEW_HEIGHT/2 - pCenterY));					
			pOffsetY = pCenterY + yPosImage;
		}
		else if(pCenterY  > WORLD_HEIGHT * MAP_WRAP_NUMBER - VIEW_HEIGHT/2) {
			var borderSpot = WORLD_HEIGHT * MAP_WRAP_NUMBER - VIEW_HEIGHT/2;
			clipY = WORLD_HEIGHT * MAP_WRAP_NUMBER - VIEW_HEIGHT + Math.min(BORDER_SIZE, Math.abs(borderSpot - pCenterY));
			pOffsetY = VIEW_HEIGHT - (WORLD_HEIGHT * MAP_WRAP_NUMBER - pCenterY) - Math.min(BORDER_SIZE, Math.abs(borderSpot - pCenterY));
			yPosImage = 0;
		}

		//drawImage(image, clipX, clipY, clipWidth, clipHeight, xPos, yPos, imageWidth, imageHeight)
		ctx.drawImage(worldMapCanvas, clipX, clipY, VIEW_WIDTH, VIEW_HEIGHT, xPosImage, yPosImage, VIEW_WIDTH, VIEW_HEIGHT);
		
		for(var i = 0; i < data.projectile.length; i++) {
			var projX = data.projectile[i].x - pCenterX + pOffsetX - 5;
			var projY = data.projectile[i].y - pCenterY + pOffsetY - 5;
			ctx.drawImage(Img.projectile, projX, projY, 10, 10);
		}

		for(var i in data.player) {
			if(i == clientId && data.player[i].alive) {
				var bottomX = pOffsetX - PLAYER_SIZE/2;
				var bottomY = pOffsetY + PLAYER_SIZE/2;
				drawHP(bottomX, bottomY, playerTeam, data.player[i]);
				
				// Draw kill count (temp / test)
				var killCount = ""+data.player[i].playerKills;
				ctx.fillText(killCount, pOffsetX + 25, pOffsetY -5);
			
				// Draw the player base and player top
				drawPlayer(pOffsetX, pOffsetY, data.player[i].directAngle, Img.playerBase, PLAYER_SIZE);
				drawPlayer(pOffsetX, pOffsetY, data.player[i].mouseAngle, Img.playerTop, PLAYER_SIZE);
			}
			else if(Math.abs(pCenterX - data.player[i].x) < VIEW_WIDTH && Math.abs(pCenterY - data.player[i].y) < VIEW_HEIGHT && data.player[i].alive) {
				var otherX = data.player[i].x - pCenterX + pOffsetX;
				var otherY = data.player[i].y - pCenterY + pOffsetY;
				drawHP(otherX, otherY + PLAYER_SIZE, playerTeam, data.player[i]);
				
				// Draw kill count (temp / test)
				var killCount = ""+data.player[i].playerKills;
				ctx.fillText(killCount, otherX + 25, otherY - 5);
				
				// Draw player base and player top
				drawPlayer(otherX + PLAYER_SIZE/2, otherY + PLAYER_SIZE/2, data.player[i].directAngle, Img.playerBase, PLAYER_SIZE);
				drawPlayer(otherX + PLAYER_SIZE/2, otherY + PLAYER_SIZE/2, data.player[i].mouseAngle, Img.playerTop, PLAYER_SIZE);
			}
		}
	});