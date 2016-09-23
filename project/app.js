var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};

var MAP_SIZE = 3000;
var WINDOW_HEIGHT = 500;
var PLAYER_SIZE = 50;
var PLAYER_RADIUS = PLAYER_SIZE/2;
var BORDER_SIZE = 32;

// ******** GAME LOOP **********************************
setInterval(function() {
	var playPackage = {
		player:Player.update(),
		projectile:Projectile.update(),
	}
	
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions', playPackage);
	}
}, 1000/25);

// ******** SOCKET MODULE ******************************
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	
	socket.emit('init',{selfId:socket.id});
	console.log("init " + socket.id);
		
	Player.onConnect(socket);	
		
	socket.on('disconnect',function() {
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});
});

// ******** PARENT OBJECT *******************************
var Entity = function() {
	var self = {
		x:250,
		y:250,
		spdX:0,
		spdY:0,
		id:"",
		size:""
	}
	self.getDistance = function(pt){
		return Math.sqrt(Math.pow(self.x-pt.x-pt.size/2,2) + Math.pow(self.y-pt.y-pt.size/2,2)); 
		
	}
	
	return self;
}

// ******** PLAYER MODULE ********************************
var Player = function(id) {
	var self = Entity();
	self.id = id;
	self.x = Math.floor((MAP_SIZE - PLAYER_SIZE) * Math.random());
	self.y = Math.floor((MAP_SIZE - PLAYER_SIZE) * Math.random());
	self.number = "" + Math.floor(10 * Math.random());
	self.pressLeft = false;
	self.pressRight = false;
	self.pressDown = false;
	self.pressUp = false;
	self.firing = false;
	self.mouseAngle = 0;
	self.turnAngle = 0;
	self.directAngle = 0;
	self.playerSpeed = 5;
	self.size = 50;
	
	self.updatePosition = function() {
		if(self.pressLeft && self.x - self.playerSpeed > BORDER_SIZE && !Player.playerCollision(self.x - self.playerSpeed, self.y, self.id)) {
			self.x -= self.playerSpeed;
			if(self.pressUp) {
				self.directAngle = -45;
			}
			else if(self.pressDown) {
				self.directAngle = -135;
			}
			else {
				self.directAngle = -90;	
			}
		}
		else if(self.pressRight && self.x + PLAYER_SIZE + self.playerSpeed < MAP_SIZE - BORDER_SIZE && !Player.playerCollision(self.x + self.playerSpeed, self.y, self.id)) {
			self.x += self.playerSpeed;
			if(self.pressUp) {
				self.directAngle = 45;
			}
			else if(self.pressDown) {
				self.directAngle = 135;
			}
			else {
				self.directAngle = 90;	
			}
		}		
		if(self.pressDown && self.y + PLAYER_SIZE + self.playerSpeed < MAP_SIZE - BORDER_SIZE && !Player.playerCollision(self.x, self.y + self.playerSpeed, self.id)) {
			self.y += self.playerSpeed;
			if(!self.pressLeft && !self.pressRight) {
				self.directAngle = 180;	
			}
		}
		else if(self.pressUp && self.y - self.playerSpeed > BORDER_SIZE && !Player.playerCollision(self.x, self.y - self.playerSpeed, self.id)) {
			self.y -= self.playerSpeed;
			if(!self.pressLeft && !self.pressRight) {
				self.directAngle = 0;	
			}
		}
		if(self.firing){
			self.shootProjectile(self.mouseAngle, self.id);
			self.turnAngle = self.mouseAngle;
		}
		self.firing = false;
	}
	
	self.shootProjectile = function(angle, shooterId){
		var projectile = Projectile(angle, shooterId);
		projectile.x = self.x + PLAYER_SIZE/2;
		projectile.y = self.y + PLAYER_SIZE/2;
	}
	Player.list[id] = self;
	return self;
}
Player.list = {};
Player.onConnect = function(socket){
	var player = Player(socket.id);
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
			console.log("lost focus");
		}
		
		if(data.inputId == 'attack'){
			player.firing = data.state;
		}

		if(data.inputId == 'mouseAngle'){
			player.mouseAngle = data.state;
		}
	});
}

Player.playerCollision = function(playerX, playerY, playerId) {
	var playCollide = false;
	var playCenterX = playerX + PLAYER_RADIUS;
	var playCenterY = playerY + PLAYER_RADIUS;

	for(var i in Player.list) {
		if(playerId != Player.list[i].id) {
			var centerX = Player.list[i].x + PLAYER_RADIUS;
			var centerY = Player.list[i].y + PLAYER_RADIUS;
		
			if(Math.abs(playCenterX - centerX) < PLAYER_SIZE && Math.abs(playCenterY - centerY) < PLAYER_SIZE){
				//collision between players detected
				playCollide = true;
			}	
		}
	}
	
	return playCollide;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
}

Player.update = function(){
	var playPackage = [];
	for(var i in Player.list) {
		var player = Player.list[i];
		player.updatePosition();
		playPackage.push({
			x:player.x,
			y:player.y,
			id:player.id,
			turnAngle:player.turnAngle,
			directAngle:player.directAngle,
			speed:player.maxSpeed,
		});
	}
	return playPackage;
}

// ******** PROJECTILE MODULE ****************************
var Projectile = function(angle, shooterId){
	var self = Entity();
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
		else if(self.x + self.spdX < BORDER_SIZE || self.x + self.spdX > MAP_SIZE - BORDER_SIZE) {
			self.toRemove = true;
		}
		else if(self.y + self.spdY < BORDER_SIZE || self.y + self.spdY > MAP_SIZE - BORDER_SIZE) {
			self.toRemove = true;
		}
		else{
			self.x += self.spdX;
			self.y += self.spdY;
			for(var i in Player.list){
				var p = Player.list[i];
				if(self.getDistance(p) < PLAYER_RADIUS && self.shooterId !== p.id){
					//collision detected
					self.toRemove = true;
				}
			}
		}
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
		}else{
			playPackage.push({
				x:projectile.x,
				y:projectile.y,
			});
		}
	}
	return playPackage;
}






