	document.onkeydown = function(event) {
		if(event.keyCode == 68 || event.keyCode == 39) {
			socket.emit('keyPress',{inputId:'right', state:true});
		}
		else if(event.keyCode == 65 || event.keyCode == 37) {
			socket.emit('keyPress',{inputId:'left', state:true});
		}
		
		else if(event.keyCode == 83 || event.keyCode == 40) {
			socket.emit('keyPress',{inputId:'down', state:true});
		}
		else if(event.keyCode == 87 || event.keyCode == 38) {
			socket.emit('keyPress',{inputId:'up', state:true});
		}
	}
	
	document.onkeyup = function(event) {
		if(event.keyCode == 68 || event.keyCode == 39) {
			socket.emit('keyPress',{inputId:'right', state:false});
		}
		else if(event.keyCode == 65 || event.keyCode == 37) {
			socket.emit('keyPress',{inputId:'left', state:false});
		}
		
		else if(event.keyCode == 83 || event.keyCode == 40) {
			socket.emit('keyPress',{inputId:'down', state:false});
		}
		else if(event.keyCode == 87 || event.keyCode == 38) {
			socket.emit('keyPress',{inputId:'up', state:false});
		}
	}
	
	ctx.canvas.onclick = function(event){
		socket.emit('keyPress',{inputId:'attack',state:true});
		Snd.shoot.currentTime = 0;
		Snd.shoot.play();
	}
	
	miniMap.canvas.onclick = function(event){
		socket.emit('keyPress',{inputId:'attack',state:true});
		Snd.shoot.currentTime = 0;
		Snd.shoot.play();
	}	
	
	document.onblur = function(event){
		socket.emit('keyPress',{inputId:'lostFocus',state:true});
	}

	ctx.canvas.onmousemove = function(event){
		var x = event.clientX - (pOffsetX + ctx.canvas.offsetLeft);
		var y = event.clientY - (pOffsetY + ctx.canvas.offsetTop);
		var angle = Math.atan2(y,x)/ Math.PI * 180;
		socket.emit('keyPress',{inputId:'mouseAngle',state:angle});
	}
	
	miniMap.canvas.onmousemove = function(event){
		var x = event.clientX - (pOffsetX + ctx.canvas.offsetLeft);
		var y = event.clientY - (pOffsetY + ctx.canvas.offsetTop);
		var angle = Math.atan2(y,x)/ Math.PI * 180;
		socket.emit('keyPress',{inputId:'mouseAngle',state:angle});
	}	