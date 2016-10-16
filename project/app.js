var express = require('express');
var app = express();
var serv = require('http').Server(app);
var listsRef = require("./lists");

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
var playerRef = require("./player");

var Player = playerRef.Player;
	
Player.list = listsRef.playerList;

Player.onConnect = function(socket){
	playerCount++;
	var player = Player(socket.id, playerCount);
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
	delete Player.list[socket.id];
	playerCount--;
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






