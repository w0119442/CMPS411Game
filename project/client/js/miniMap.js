	var miniMapOn = false;
	
	miniMapButton.onclick = function() {
		toggleMiniMap();
	}
	
	function toggleMiniMap() {
		if(!miniMapOn) {
			miniMapOn = true;
			miniMap.canvas.style.display = "block";
		}
		else {
			miniMapOn = false;
			miniMap.canvas.style.display = "none";			
		}
	}