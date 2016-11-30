	var socket = io();
	var clientId = null;
	var playerTeam = 0;
	var pKills = 0;
//	var deadPlayerIds = {};
	
	socket.on('init',function(data) {
		if(data.selfId && data.selfId != -1) {
			clientId = data.selfId;	
		}
		else {
			window.location.replace('/bigMap');
		}
	});
	
	/*
	socket.on('death',function(data) {
		if(data.deadPlayersId) {
			deadPlayerIds.push(data.deadPlayerId);
			alert("data.deadPlayerId");
		}
	});*/
	
	var pCenterX = 0.0;
	var pCenterY = 0.0;
	var pOffsetX = 0.0;
	var pOffsetY = 0.0;
	
	socket.on('newPositions',function(data) {
		ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
		var patrnBack = ctx.createPattern(Img.bgtile, "repeat");
		ctx.fillStyle = patrnBack;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
		playerTeam = data.player[clientId].team;
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
				
				// Draw player name
				var playerName = data.player[i].nickname;
				var nameLength = playerName.length;
				var startName = (pOffsetX - PLAYER_SIZE/2) + (1 - nameLength/6) * (PLAYER_SIZE/2);
				ctx.font = '15px Arial';
				ctx.fillText(playerName, startName, pOffsetY - 25);
				
				// Draw magazine 
				var magazine = "" + data.player[i].magazine;
				ctx.font = '20px Arial';
				ctx.fillText(magazine, pOffsetX + PLAYER_SIZE/2, pOffsetY -5);
				
				if(data.player[i].playerKills > pKills) {
					Snd.death.currentTime = 0;
					Snd.death.play();
					pKills = data.player[i].playerKills;
				}
			
				// Draw the player base and player top
				drawPlayer(pOffsetX, pOffsetY, data.player[i].directAngle, Img.playerBase, PLAYER_SIZE);
				drawPlayer(pOffsetX, pOffsetY, data.player[i].mouseAngle, Img.playerTop, PLAYER_SIZE);
			}
			else if(Math.abs(pCenterX - data.player[i].x) < VIEW_WIDTH && Math.abs(pCenterY - data.player[i].y) < VIEW_HEIGHT) {
				if(data.player[i].alive) {
					var otherX = data.player[i].x - pCenterX + pOffsetX;
					var otherY = data.player[i].y - pCenterY + pOffsetY;
					drawHP(otherX, otherY + PLAYER_SIZE, playerTeam, data.player[i]);
				
					// Draw player name
					var playerName = data.player[i].nickname;
					var nameLength = playerName.length;
					var startName = (otherX - PLAYER_SIZE/2) + (1 - nameLength/6) * (PLAYER_SIZE/2);					
					ctx.font = '15px Arial';
					ctx.fillText(playerName, startName, otherY - 25);
					
					// Draw kill count (temp / test)
					//var killCount = "" + data.player[i].playerKills;
					//ctx.font = '30px Arial';
					//ctx.fillText(killCount, otherX + PLAYER_SIZE/2, otherY - 5);
				
					// Draw player base and player top
					drawPlayer(otherX + PLAYER_SIZE/2, otherY + PLAYER_SIZE/2, data.player[i].directAngle, Img.playerBase, PLAYER_SIZE);
					drawPlayer(otherX + PLAYER_SIZE/2, otherY + PLAYER_SIZE/2, data.player[i].mouseAngle, Img.playerTop, PLAYER_SIZE);	
				}
			}
		}
		
		//draw base
		for(var i in data.base){
			if(Math.abs(pCenterX - data.base[i].x) < VIEW_WIDTH && Math.abs(pCenterY - data.base[i].y) < VIEW_HEIGHT) {
				var flagSize = PLAYER_SIZE/2;
				var baseX = data.base[i].x - pCenterX + pOffsetX;
				var baseY = data.base[i].y - pCenterY + pOffsetY;

				ctx.drawImage(Img.base, baseX, baseY, 200, 200);
				//drawBaseHP(data.base[i].x, data.base[i].y, playerTeam, data.base[i]);
				drawBaseHP(baseX, baseY + 200 , playerTeam, data.base[i]);
			}
		}
		
		if(miniMapOn) {
			var isPlayer = false;
			miniMap.clearRect(0, 0, miniMap.canvas.width, miniMap.canvas.height);
			miniMap.globalAlpha = 0.4;	
			miniMap.fillStyle = hpLine;			
			miniMap.fillRect(0, 0, miniMap.canvas.width, miniMap.canvas.height);	
			
			for(var i in data.player) {
				if(i == clientId) {
					isPlayer = true;
				}
				else {
					isPlayer = false;
				}
				
				if(data.player[i].alive) {
					drawMiniMap(isPlayer, data.player[i].x, data.player[i].y, data.player[i].team, playerTeam);
				}
			}
		}
		
		for(var i = 0; i < data.flag.length; i++) {
			if(Math.abs(pCenterX - data.flag[i].x) < VIEW_WIDTH && Math.abs(pCenterY - data.flag[i].y) < VIEW_HEIGHT) {
				var flagSize = PLAYER_SIZE/2;
				var flagX = data.flag[i].x - pCenterX + pOffsetX - 10;
				var flagY = data.flag[i].y - pCenterY + pOffsetY - 5;

				ctx.drawImage(Img.flag, flagX, flagY, flagSize, flagSize);	
			}
		}
		showScore(data.score);
	});