// player.js

var globals = require("./globals");
var listsRef = require("./lists");
var projectileRef = require("./projectile");
var Projectile = projectileRef.Projectile;

(function(){
	var Player = function(id, add) {
		var self = {};
		self.id = id;
		self.nickname = "";
		self.address = add;
		self.team = listsRef.playerTeam();		
		self.pressLeft = false;
		self.pressRight = false;
		self.pressDown = false;
		self.pressUp = false;
		self.firing = false;
		self.mouseAngle = 0;
		self.directAngle = 0;
		self.playerSpeed = 5;
		self.alive = true;
		self.hp = 3;
		self.deathTimer = 0;
		self.magazine = 5;
		self.reloadTimer = 0;
		self.playerKills = 0;
		self.size = 50;
		self.radius = self.size / 2;
		//self.x = Math.floor((globals.MAP_SIZE - self.size) * Math.random());
		//self.y = Math.floor((globals.MAP_SIZE - self.size) * Math.random());
		if (self.team == 0){
			self.x = self.size;
		}
		else{
			self.x = globals.MAP_SIZE - self.size;
		}
		self.y = globals.MAP_SIZE / 2;
		
		console.log("team " + self.team);
		
		self.respawn = function(){
			self.alive = true;
			self.hp = 3;
			self.deathTimer = 0;
			if (self.team == 0){
				self.x = self.size;
			}
			else{
				self.x = globals.MAP_SIZE - self.size;
			}
			self.y = globals.MAP_SIZE / 2;
		}
		
		self.reload = function(){
			self.magazine = 5;
			self.reloadTimer = 0;
		}
		
		self.updatePosition = function() {		
			if(self.pressLeft && self.x - self.playerSpeed > 0 && !self.playerCollision(self.x - self.playerSpeed, self.y)) {
				self.x -= self.playerSpeed;
				if(self.pressUp) {
					self.directAngle = -135;
				}
				else if(self.pressDown) {
					self.directAngle = 135;
				}
				else {
					self.directAngle = 180;
				}
			}
			else if(self.pressRight && self.x + self.size + self.playerSpeed < globals.MAP_SIZE && !self.playerCollision(self.x + self.playerSpeed, self.y)) {
				self.x += self.playerSpeed;		
				if(self.pressUp) {
					self.directAngle = -45;
				}
				else if(self.pressDown) {
					self.directAngle = 45;
				}
				else {
					self.directAngle = 0;		
				}
			}		
			if(self.pressDown && self.y + self.size + self.playerSpeed < globals.MAP_SIZE && !self.playerCollision(self.x, self.y + self.playerSpeed)) {
				self.y += self.playerSpeed;
				if(!self.pressLeft && !self.pressRight) {
					self.directAngle = 90;	
				}
			}
			else if(self.pressUp && self.y - self.playerSpeed > 0 && !self.playerCollision(self.x, self.y - self.playerSpeed)) {
				self.y -= self.playerSpeed;
				if(!self.pressLeft && !self.pressRight) {
					self.directAngle = -90;				
				}
			}
			if(self.firing){
				self.shootProjectile(self.mouseAngle, self.id);
				
			}
			self.firing = false;
		}
		
		self.playerCollision = function(playerX, playerY) {
			var playCollide = false;
			var playCenterX = playerX + self.radius;
			var playCenterY = playerY + self.radius;
		
			for(var i in Player.list) {
				if(Player.list[i].id != self.id && self.team != Player.list[i].team && Player.list[i].alive) {
					var centerX = Player.list[i].x + self.radius;
					var centerY = Player.list[i].y + self.radius;
				
					if(Math.abs(playCenterX - centerX) < self.size && Math.abs(playCenterY - centerY) < self.size){
						//collision between players detected
						playCollide = true;
					}	
				}
			}
		
			return playCollide;
		}
		
		self.shootProjectile = function(angle, shooterId){
			if(self.magazine > 0){
				var projectile = Projectile(angle, shooterId);
				self.magazine--;
				projectile.x = self.x + self.radius;
				projectile.y = self.y + self.radius;
			}
		}
		
		listsRef.playerList[self.id] = self;
		return self;
	}
	
	module.exports.Player = Player;

}());