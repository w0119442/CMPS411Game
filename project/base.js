// base.js

var globals = require("./globals");
var listsRef = require("./lists");


(function(){
	var Base = function(team) {
		var self = {};
		self.team = team;		
		self.alive = true;
		self.hp = 3;
		self.deathTimer = 0;
		self.size = 200;
		self.radius = self.size / 2;
		if (self.team == 0){
			self.x = 0;
		}
		else{
			self.x = globals.MAP_SIZE - self.size;
		}
		self.y = (globals.MAP_SIZE / 2) - self.radius;
		
		self.respawn = function(){
			self.alive = true;
			self.hp = 3;
			self.deathTimer = 0;
		}
		
		self.bombCollision = function() {
			var bombCollide = false;
			var baseCenterX = self.x + self.radius;
			var baseCenterY = self.y + self.radius;
		
			for(var i in listsRef.flagList) {				
				var bombX = listsRef.flagList[i].x + listsRef.flagList[i].radius;
				var bombY = listsRef.flagList[i].y + listsRef.flagList[i].radius;
				//console.log("bomb x distance to base " + self.team + ": " + (baseCenterX - bombX));
				//console.log("bomb y distance to base " + self.team + ": " + (baseCenterY - bombY));
				//console.log("bomb trigger distance " + self.team + ": " + (self.radius + listsRef.flagList[i].radius));

				if(Math.abs(baseCenterX - bombX) < (self.radius + listsRef.flagList[i].radius) && Math.abs(baseCenterY - bombY) < (self.radius + listsRef.flagList[i].radius)){
					//collision between bomb and base detected	
					console.log('boom!');
					bombCollide = true;
					listsRef.flagList[i].carrierId = null;
					listsRef.flagList[i].x = (globals.MAP_SIZE / 2) + listsRef.flagList[i].radius;
					listsRef.flagList[i].y = (globals.MAP_SIZE / 2) + listsRef.flagList[i].radius;
				}
				
			}
		
			return bombCollide;
		}
		
		listsRef.baseList[self.team] = self;
		console.log("Base for team " + self.team);
		return self;
	}
	
	module.exports.Base = Base;

}());