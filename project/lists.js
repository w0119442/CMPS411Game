// lists.js

var playerRef = require("./player");
var Player = playerRef.Player;

var projectileRef = require("./projectile");
var Projectile = projectileRef.Projectile;

var flagRef = require("./flag");
var Flag = flagRef.Flag;

Player.list = {};
Projectile.list = {};
Flag.list = {};

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