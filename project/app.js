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
var PLAYER_LIST = {};

var WORLD_WIDTH = 500;
var WINDOW_HEIGHT = 500;
var MAP_SIZE = 1000;
var PLAYER_SIZE = 50;

// ******** GAME LOOP **********************************
setInterval(function() {
	var playPackage = Player.update();
	
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
		x:0,
		y:0,
		spdX:0,
		spdY:0,
		id:"",
	}
	self.update = function(){
		self.updatePosition();
	}
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
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
	self.playerSpeed = 5;
	
	self.updatePosition = function() {
		if(self.pressLeft && self.x - self.playerSpeed > 0) {
			self.x -= self.playerSpeed;
		}
		else if(self.pressRight && self.x + PLAYER_SIZE + self.playerSpeed < MAP_SIZE) {
			self.x += self.playerSpeed;
		}		
		if(self.pressDown && self.y + PLAYER_SIZE + self.playerSpeed < MAP_SIZE) {
			self.y += self.playerSpeed;
		}
		else if(self.pressUp && self.y - self.playerSpeed > 0) {
			self.y -= self.playerSpeed;
		}
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
	});
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
			speed:player.maxSpeed,
		});
	}
	return playPackage;
}

// ******** BULLET MODULE ******************************

