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

var WINDOW_WIDTH = 500;
var WINDOW_HEIGHT = 500;

var Player = function(identity) {
	var self = {
		x:Math.floor(WINDOW_WIDTH * Math.random()),
		y:Math.floor(WINDOW_HEIGHT * Math.random()),
		id:identity,
		number:"" + Math.floor(10 * Math.random()),
		pressLeft:false,
		pressRight:false,
		pressDown:false,
		pressUp:false,
		maxSpeed:10
	}
	self.updatePosition = function() {
		if(self.pressLeft) {
			self.x -= self.maxSpeed;
		}
		else if(self.pressRight) {
			self.x += self.maxSpeed;
		}
		
		else if(self.pressDown) {
			self.y += self.maxSpeed;
		}
		else if(self.pressUp) {
			self.y -= self.maxSpeed;
		}
	}
	return self;
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	
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
		else if(data.inputId == 'down') {
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
			number:player.number
		});
	}
	
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions', playPackage);
	}
}, 1000/25);
