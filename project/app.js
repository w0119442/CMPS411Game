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
var MAP_SIZE = 5000;
var PLAYER_SIZE = 50;

var Player = function(identity) {
	var self = {
		x:Math.floor((MAP_SIZE - PLAYER_SIZE) * Math.random()),
		y:Math.floor((MAP_SIZE - PLAYER_SIZE) * Math.random()),
//		x:Math.floor(WINDOW_WIDTH * Math.random()),
//		y:Math.floor(WINDOW_HEIGHT * Math.random()),
		id:identity,
		number:"" + Math.floor(10 * Math.random()),
		pressLeft:false,
		pressRight:false,
		pressDown:false,
		pressUp:false,
		maxSpeed:5
	}
	self.updatePosition = function() {
		if(self.pressLeft && self.x - self.maxSpeed > 0) {
			self.x -= self.maxSpeed;
		}
		else if(self.pressRight && self.x + PLAYER_SIZE + self.maxSpeed < MAP_SIZE) {
			self.x += self.maxSpeed;
		}		
		if(self.pressDown && self.y + PLAYER_SIZE + self.maxSpeed < MAP_SIZE) {
			self.y += self.maxSpeed;
		}
		else if(self.pressUp && self.y - self.maxSpeed > 0) {
			self.y -= self.maxSpeed;
		}
	}
	
	return self;
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	var sessionid = socket.id;
	SOCKET_LIST[socket.id] = socket;
	
	socket.emit('init',{selfId:sessionid});
	console.log("init " + sessionid);
	
	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;
	
	socket.on('disconnect',function() {
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});
	
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
});

setInterval(function() {
	var playPackage = [];
	for(var i in PLAYER_LIST) {
		var player = PLAYER_LIST[i];
		player.updatePosition();
		playPackage.push({
			x:player.x,
			y:player.y,
			id:player.id,
			speed:player.maxSpeed,
		});
	}
	
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions', playPackage);
	}
}, 1000/25);
