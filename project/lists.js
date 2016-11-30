// lists.js

var playerRef = require("./player");
var Player = playerRef.Player;

var projectileRef = require("./projectile");
var Projectile = projectileRef.Projectile;

var flagRef = require("./flag");
var Flag = flagRef.Flag;

var botsRef = require("./bots");
var Bot = botsRef.Bot;

var baseRef = require("./base");
var Base = baseRef.Base;

Player.list = {};
Projectile.list = {};
Flag.list = {};
Bot.list = {};
Base.list = {};

(function(){
	module.exports.playerList = Player.list;
	module.exports.projectileList = Projectile.list;
	module.exports.flagList = Flag.list;	
	module.exports.botList = Bot.list;
	module.exports.baseList = Base.list;
	
	module.exports.playerTeam = function(){
		var count0 = 0;
		var count1 = 0;
		
		for (var i in Player.list) {
			if (Player.list[i].team == 0){
				count0++;
			}
			else if(Player.list[i].team == 1) {
				count1++;
			}
		}
		
		if(count0 < count1) {
			return 0;
		}
		else {
			return 1;
		}
	}
}());

/*
(function(){
	module.exports.playerList = Player.list;
	module.exports.playerCount = function(){
		var count = 0;
		for (var i in Player.list) {
			if (Player.list.hasOwnProperty(i)){
				count++;
			}
		}
		return count;
	}
	module.exports.projectileList = Projectile.list;
	module.exports.flagList = Flag.list;
}());
*/