var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var serv = require('http').Server(app);
var listsRef = require("./lists");
var globals = require("./globals");

app.use(cookieParser());

//set cookie
app.use(function(req, res, next) {
	var cookie = req.cookies.cookieName;
	if(cookie == undefined) {
		var cookieId = Math.random().toString();
		cookieId = cookieId.substring(2, cookieId.length);
		res.cookie('cookieName', cookieId, {maxAge: 900000, httpOnly: true});
		console.log('cookie created successfully');
	}
	next();
});

app.get('/bigMap',function(req, res) {
	res.sendFile(__dirname + '/server/bigMap.html');
});

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));
app.use('/server',express.static(__dirname + '/server'));
app.use('/css',express.static('client/css'));

serv.listen(80); // change back to 80 for server
console.log("Server started.");


// ******** GAME LOOP **********************************
setInterval(function() {
	var playPackage = {
		player:Player.update(),
		projectile:Projectile.update(),
		flag:Flag.update(),
		base:Base.update(),
	}
	//console.log("base 0's x: " + playPackage.base[0].x);
	//console.log("base 1's x: " + playPackage.base[1].x);
	

	io.emit('newPositions', playPackage);
}, 1000/25);

// ******** SOCKET MODULE ******************************
var ipAdd = [];

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	//var address = Math.random() * 1000; //socket.handshake.address;
	var cookieId = socket.handshake.headers.cookie;
	var cookieName = cookieId.split(';')[1];
	var address = cookieName;
	if(cookieName != undefined) {
		address = cookieName.split('=')[1];
	}
	console.log("Address: " + address);
	
	if(address == undefined || ipAdd.length < 1 || ipAdd.indexOf(address) == -1 && ipAdd.length < 100) {
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
var botRef = require("./bot");

Player.onConnect = function(socket, add){
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
	socket.on('setNickname', function(data) {
		player.nickname = data.value;
	});
}
Player.onDisconnect = function(socket, address){
	for(var i in Flag.list) {
		var flag = Flag.list[i];
		if(flag.carrierId == socket.id){
			flag.carrierId = null;
		}
	}
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
		if(player.id >= 1) {
			listsRef.botList[player.id].fireDelay++;
			botRef.actionBots(player.id);
			botRef.resetBot(player.id);
		}
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
			nickname:player.nickname,
		};
	}
	return playPackage;
}

// ******** BOT MODULE ****************************
var botsRef = require("./bots");

botsRef.createBots();

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

// ******** FLAG MODULE ****************************
var flagRef = require("./flag");

var Flag = flagRef.Flag;

Flag.list = listsRef.flagList;
flagRef.Flag();
//console.log(Flag);

Flag.update = function(){
	var playPackage = [];
	for(var i in Flag.list) {
		var flag = Flag.list[i];
		flag.updatePosition();
		playPackage.push({
			x:flag.x,
			y:flag.y,
		});
	}
	return playPackage;
}

// ******** BASE MODULE ****************************
var baseRef = require("./base");

var Base = baseRef.Base;

Base.list = listsRef.baseList;
baseRef.Base(0);
baseRef.Base(1);
//console.log(Base);

Base.update = function(){
	var playPackage = {};
	for(var i in Base.list) {
		//console.log('update base ' + i);
		var base = Base.list[i];
		if(base.bombCollision()){
			base.hp--;
		}
		playPackage[i] ={
			x:base.x,
			y:base.y,
			hp:base.hp,
		};
	}
	return playPackage;
}