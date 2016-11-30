// bots.js

var globals = require("./globals");
var playerRef = require("./player");
var listsRef = require("./lists");

(function(){
	var names = ["Baal", "Vivi", "Crystal", "Jona", "Hades", "Cthulu", "Diablo", "Chris", "Dagon", "Wendy", "Link", "Zelda"];	
	
	var Bot = function(id, add) {
		var self = playerRef.Player(id, add);
		self.destX = Math.floor((globals.MAP_SIZE - self.size) * Math.random());
		self.destY = Math.floor((globals.MAP_SIZE - self.size) * Math.random());
		self.fireDelay = 0;
		
		listsRef.botList[id] = self;
		//var index = id % 10;
		listsRef.playerList[id].nickname = names[id];
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