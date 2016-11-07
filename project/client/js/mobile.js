function detectMob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

function mobileKeypad() {
	mobileButtons.style.display = "block";
	
	mobileUpLeft.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:true});
		socket.emit('keyPress',{inputId:'down', state:false});		
		socket.emit('keyPress',{inputId:'left', state:true});
		socket.emit('keyPress',{inputId:'right', state:false});		
	}
	mobileUp.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:true});
		socket.emit('keyPress',{inputId:'down', state:false});		
		socket.emit('keyPress',{inputId:'left', state:false});
		socket.emit('keyPress',{inputId:'right', state:false});		
	}
	mobileUpRight.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:true});
		socket.emit('keyPress',{inputId:'down', state:false});		
		socket.emit('keyPress',{inputId:'left', state:false});
		socket.emit('keyPress',{inputId:'right', state:true});		
	}
	mobileLeft.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:false});
		socket.emit('keyPress',{inputId:'down', state:false});		
		socket.emit('keyPress',{inputId:'left', state:true});
		socket.emit('keyPress',{inputId:'right', state:false});		
	}
	mobileRight.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:false});
		socket.emit('keyPress',{inputId:'down', state:false});		
		socket.emit('keyPress',{inputId:'left', state:false});
		socket.emit('keyPress',{inputId:'right', state:true});		
	}
	mobileDownLeft.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:false});
		socket.emit('keyPress',{inputId:'down', state:true});		
		socket.emit('keyPress',{inputId:'left', state:true});
		socket.emit('keyPress',{inputId:'right', state:false});		
	}
	mobileDown.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:false});
		socket.emit('keyPress',{inputId:'down', state:true});		
		socket.emit('keyPress',{inputId:'left', state:false});
		socket.emit('keyPress',{inputId:'right', state:false});		
	}
	mobileDownRight.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:false});
		socket.emit('keyPress',{inputId:'down', state:true});		
		socket.emit('keyPress',{inputId:'left', state:false});
		socket.emit('keyPress',{inputId:'right', state:true});		
	}	
	mobileNull.onclick = function() {
		socket.emit('keyPress',{inputId:'up', state:false});
		socket.emit('keyPress',{inputId:'down', state:false});		
		socket.emit('keyPress',{inputId:'left', state:false});
		socket.emit('keyPress',{inputId:'right', state:false});		
	}
	
}