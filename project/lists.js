// lists.js

var playerRef = require("./player");
var Player = playerRef.Player;

var projectileRef = require("./projectile");
var Projectile = projectileRef.Projectile;

Player.list = {};
Projectile.list = {};

(function(){
	module.exports.playerList = Player.list;
	module.exports.projectileList = Projectile.list;
}());