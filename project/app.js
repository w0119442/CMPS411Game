var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
app.use('/css',express.static('client/css'));

serv.listen(2000);
console.log("Server started.");


var MAP_SIZE = 3000;

var playerCount = 0;


// ******** GAME LOOP **********************************
setInterval(function() {
	var playPackage = {
		player:Player.update(),
		projectile:Projectile.update(),
	}

	io.emit('newPositions', playPackage);
}, 1000/25);

// ******** SOCKET MODULE ******************************
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	
	socket.emit('init',{selfId:socket.id});
	console.log("init " + socket.id);
		
	Player.onConnect(socket);	
		
	socket.on('disconnect',function() {
		Player.onDisconnect(socket);
	});
});


// ******** PLAYER MODULE ********************************
var Player = function(id) {
	var self = {};
	self.id = id;
	self.team = playerCount % 2;
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
	self.playerKills = 0;
	self.size = 50;
	self.radius = self.size / 2;
	self.x = Math.floor((MAP_SIZE - self.size) * Math.random());
	self.y = Math.floor((MAP_SIZE - self.size) * Math.random());
	
	console.log("team " + self.team);
	
	self.respawn = function(){
		self.alive = true;
		self.hp = 3;
		self.deathTimer = 0;
		self.x = Math.floor((MAP_SIZE - self.size) * Math.random());
		self.y = Math.floor((MAP_SIZE - self.size) * Math.random());
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
		else if(self.pressRight && self.x + self.size + self.playerSpeed < MAP_SIZE && !self.playerCollision(self.x + self.playerSpeed, self.y)) {
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
		if(self.pressDown && self.y + self.size + self.playerSpeed < MAP_SIZE && !self.playerCollision(self.x, self.y + self.playerSpeed)) {
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
		if(Player.list[i].id != self.id && self.team != Player.list[i].team) {
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
		var projectile = Projectile(angle, shooterId);
		projectile.x = self.x + self.radius;
		projectile.y = self.y + self.radius;
	}
	Player.list[id] = self;
	return self;
}

Player.list = {};

Player.onConnect = function(socket){
	var player = Player(socket.id);
	playerCount++;
	socket.on('keyPress', function(data) {
		if(data.inputId == 'left') {
			player.pressLeft = data.state;
		}
		else if(data.inputId == 'right') {
			player.pressRight = data.state;
		}	
		if(data.inputId == 'down') {
			player.pressDown = data.state;
		}
		else if(data.inputId == 'up') {
			player.pressUp = data.state;
		}
		if(data.inputId == 'lostFocus'){
			player.pressUp = false;
			player.pressDown = false;
			player.pressRight = false;
			player.pressLeft = false;
		}
		
		if(data.inputId == 'attack'){
			player.firing = data.state;
		}

		if(data.inputId == 'mouseAngle'){
			player.mouseAngle = data.state;
		}
	});
}
Player.onDisconnect = function(socket){
	playerCount--;	
	delete Player.list[socket.id];
}

Player.update = function(){
	var playPackage = {};
	for(var i in Player.list) {
		var player = Player.list[i];
		if (player.hp < 1){
			if (player.deathTimer++ > 100){
				player.respawn();
			}else{
				player.alive = false;
			}
		}
		else{
			player.updatePosition();
		}
		playPackage[i] ={
			x:player.x,
			y:player.y,
			mouseAngle:player.mouseAngle,
			directAngle:player.directAngle,
			speed:player.maxSpeed,
			hp:player.hp,
			team:player.team,
			alive:player.alive,
			playerKills:player.playerKills,
		};
	}
	return playPackage;
}

// ******** PROJECTILE MODULE ****************************
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
		else if(self.x + self.spdX < 0 || self.x + self.spdX > MAP_SIZE) {
			self.toRemove = true;
		}
		else if(self.y + self.spdY < 0 || self.y + self.spdY > MAP_SIZE) {
			self.toRemove = true;
		}
		else{
			self.x += self.spdX;
			self.y += self.spdY;
			for(var i in Player.list){
				var player = Player.list[i];
				if(self.getDistance(player) < player.radius && player.alive && self.shooterId !== player.id && Player.list[shooterId].team != player.team){
					//collision detected
					player.hp--;
					if (player.hp < 1){
						for(var j in Player.list){
							if(Player.list[j].id == self.shooterId){
								Player.list[j].playerKills++;
							}
						}
					}
					self.toRemove = true;
				}
			}
		}
	}
	self.getDistance = function(player){
		return Math.sqrt(Math.pow(self.x - player.x - player.size / 2, 2) + Math.pow(self.y - player.y - player.size / 2, 2)); 		
	}
	Projectile.list[self.id] = self;
	return self;
}
Projectile.list = {};
Projectile.update = function(){
	var playPackage = [];
	for(var i in Projectile.list) {
		var projectile = Projectile.list[i];
		projectile.updatePosition();
		if(projectile.toRemove){
			delete Projectile.list[i];
		}
		else{
			playPackage.push({
				x:projectile.x,
				y:projectile.y,
			});
		}
	}
	return playPackage;
}






