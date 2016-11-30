// bots.js

var globals = require("./globals");
var playerRef = require("./player");
var listsRef = require("./lists");

(function(){
	var Bot = function(id, add) {
		var self = playerRef.Player(id, add);
		self.destX = Math.floor((globals.MAP_SIZE - self.size) * Math.random());
		self.destY = Math.floor((globals.MAP_SIZE - self.size) * Math.random());
		self.fireDelay = 0;
		
		listsRef.botList[id] = self;
		listsRef.playerList[id].nickname = "Bot"+id;
		return self;
	}
	
	module.exports.Bot = Bot;
	
	module.exports.createBots = function() {
		var numOfBots = 10;
		
		for(var i = 1; i <= numOfBots; i++) {
			Bot(i,i);
		}
	}
}());