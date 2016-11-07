// bot.js

var globals = require("./globals");

var playerRef = require("./player");
var Player = playerRef.Player;

var projectileRef = require("./projectile");
var Projectile = projectileRef.Projectile;

var flagRef = require("./flag");
var Flag = flagRef.Flag;

var listsRef = require("./lists");

(function() {
	
	module.exports.resetBot = function(index) {
		var pKills = listsRef.playerList[index].playerKills;
		var isAlive = listsRef.playerList[index].alive;
		
		if(pKills > 25 && !isAlive) {
			listsRef.playerList[index].playerKills = 0;
		}
	}

	module.exports.actionBots = function(index) {
		var playerX = listsRef.playerList[index].x;
		var playerY = listsRef.playerList[index].y;
		var destX = listsRef.botList[index].destX;
		var destY = listsRef.botList[index].destY;
		var playerTeam = listsRef.playerList[index].team;		
		
		var viewRange = 100;
		
		if(Math.abs(playerX - destX) > 10 && Math.abs(playerY - destY) > 10) {
			if(playerX - destX == 0) {
				listsRef.playerList[index].pressLeft = false;
				listsRef.playerList[index].pressRight = false;
			}
			else if(playerX - destX > 0) {
				listsRef.playerList[index].pressLeft = true;
				listsRef.playerList[index].pressRight = false;				
			}
			else {
				listsRef.playerList[index].pressLeft = false;
				listsRef.playerList[index].pressRight = true;				
			}
			
			if(playerY - destY == 0) {
				listsRef.playerList[index].pressUp = false;
				listsRef.playerList[index].pressDown = false;
			}
			else if(playerY - destY > 0) {
				listsRef.playerList[index].pressUp = true;
				listsRef.playerList[index].pressDown = false;				
			}
			else {
				listsRef.playerList[index].pressUp = false;
				listsRef.playerList[index].pressDown = true;				
			}			
		}
		else {
			listsRef.botList[index].destX = Math.floor((globals.MAP_SIZE - listsRef.playerList[index].size) * Math.random());
			listsRef.botList[index].destY = Math.floor((globals.MAP_SIZE - listsRef.playerList[index].size) * Math.random());
			
			listsRef.playerList[index].pressUp = false;
			listsRef.playerList[index].pressDown = false;
			listsRef.playerList[index].pressLeft = false;
			listsRef.playerList[index].pressRight = false;			
		}
		
		for(var i in listsRef.playerList) {
			if(listsRef.playerList[i].id != index) {
				var fireLimit = Math.floor(30 * Math.random()) + 10;
				
				var otherTeam = listsRef.playerList[i].team;
				var otherX = listsRef.playerList[i].x;
				var otherY = listsRef.playerList[i].y;
			
				if((Math.abs(playerX - otherX) < viewRange || Math.abs(playerY - otherY) < viewRange) && playerTeam != otherTeam) {
					var x = otherX - playerX;
					var y = otherY - playerY;
					var angle = Math.atan2(y,x)/ Math.PI * 180;
					listsRef.playerList[index].mouseAngle = angle;
					
					if(listsRef.botList[index].fireDelay == 0)
						listsRef.playerList[index].firing = true;
					else {
						listsRef.playerList[index].firing = false;
						if(listsRef.botList[index].fireDelay > fireLimit) {
							listsRef.botList[index].fireDelay = 0;
						}
					}
				}
			}
		}
	}
	
}());