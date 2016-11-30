// flag.js

var globals = require("./globals");
var listsRef = require("./lists");

(function(){
	var Flag = function(){
		var self = {};
		self.id = Math.random();
		self.carrierId = null;
		self.toRemove = false;
		self.size = 20;
		self.radius = self.size / 2;
		self.x = (globals.MAP_SIZE / 2) - self.radius;
		self.y = (globals.MAP_SIZE / 2) - self.radius;
		self.updatePosition = function() {
			if(self.carrierId != null) {
				var player = listsRef.playerList[self.carrierId];
				if(player.alive){
					self.x = player.x;
					self.y = player.y;
				}
				else{
					self.carrierId = null;
				}
			}			
			else{
				for(var i in listsRef.playerList){
					var player = listsRef.playerList[i];
					if(self.getDistance(player) < player.radius){
						//pickup detected
						self.carrierId = player.id;
					}
				}
			}
		}
		self.getDistance = function(player){
			return Math.sqrt(Math.pow(self.x - player.x - player.size / 2, 2) + Math.pow(self.y - player.y - player.size / 2, 2)); 		
		}
		
		listsRef.flagList[self.id] = self;
	}
	
	module.exports.Flag = Flag;
	
}());