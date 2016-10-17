// projectile.js

var globals = require("./globals");

var listsRef = require("./lists");

var playerRef = require("./player");
var Player = playerRef.Player;


(function(){
	var Projectile = function(angle, shooterId){
		var self = {};
		self.id = Math.random();
		self.shooterId = shooterId;
		self.spdX = Math.cos(angle/180*Math.PI) * 10;
		self.spdY = Math.sin(angle/180*Math.PI) * 10;	
		self.timer = 0;
		self.toRemove = false;
		self.size = 10;
		self.updatePosition = function() {
			if(self.timer++ > 100){
				self.toRemove = true;
			}
			else if(self.x + self.spdX < 0 || self.x + self.spdX > globals.MAP_SIZE) {
				self.toRemove = true;
			}
			else if(self.y + self.spdY < 0 || self.y + self.spdY > globals.MAP_SIZE) {
				self.toRemove = true;
			}
			else{
				self.x += self.spdX;
				self.y += self.spdY;
				for(var i in listsRef.playerList){
					var player = listsRef.playerList[i];
					if(self.getDistance(player) < player.radius && player.alive && self.shooterId !== player.id && listsRef.playerList[self.shooterId].team != player.team){
						//collision detected
						player.hp--;
						if (player.hp < 1){
							listsRef.playerList[self.shooterId].playerKills++;
						}
						self.toRemove = true;
					}
				}
			}
		}
		self.getDistance = function(player){
			return Math.sqrt(Math.pow(self.x - player.x - player.size / 2, 2) + Math.pow(self.y - player.y - player.size / 2, 2)); 		
		}
		listsRef.projectileList[self.id] = self;
		return self;
	}
	
	module.exports.Projectile = Projectile;
	
}());