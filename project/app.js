var express = require('express');
var app = express();
var serv = require('http').Server(app);
var listsRef = require("./lists");
var globals = require("./globals");

app.get('/bigMap',function(req, res) {
	res.sendFile(__dirname + '/server/bigMap.html');
});

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));
app.use('/server',express.static(__dirname + '/server'));
app.use('/css',express.static('client/css'));

serv.listen(2000);
console.log("Server started.");


// ******** GAME LOOP **********************************
setInterval(function() {
	var playPackage = {
		player:Player.update(),
		projectile:Projectile.update(),
	}

	io.emit('newPositions', playPackage);
}, 1000/25);

// ******** SOCKET MODULE ******************************
var ipAdd = [];

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("Address: " + address);
	
	if(ipAdd.length < 1 || ipAdd.indexOf(address) == -1 && playerCount < 26) {
		ipAdd.push(address);
		
		socket.id = Math.random();
	
		socket.emit('init',{selfId:socket.id, selfAdd:address});
		console.log("init " + socket.id);
		
		Player.onConnect(socket, address);	
		
		socket.on('disconnect',function() {
			Player.onDisconnect(socket, address);
		});
	}
	else {
		socket.emit('init',{selfId:-1, selfAdd:address});
	}
});


// ******** PLAYER MODULE ********************************
var playerRef = require("./player");
var Player = playerRef.Player;	
Player.list = listsRef.playerList;

var playerCount = 0;

Player.onConnect = function(socket, add){
	playerCount++;
	var player = Player(socket.id, add);
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
Player.onDisconnect = function(socket, address){
	playerCount--;	
	var index = ipAdd.indexOf(address);
	if(index > -1) {
		ipAdd.splice(index, 1);
	}
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
			id:player.id,
			add:player.address,
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
var projectileRef = require("./projectile");

var Projectile = projectileRef.Projectile;

Projectile.list = listsRef.projectileList;

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