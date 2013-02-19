function Controller() {
	var self = this;
	self.gamepad = null;
	self.ws = null;
	self.robotIsMoving = false;
	
	self.init = function(ws) {		
		// visual controller support
		$("#forward").mousedown(function(){
			ws.send("command-1");
		});
		
		$("#backward").mousedown(function(){
			ws.send("command-2");
		});
		
		$("#left").mousedown(function(){
			ws.send("command-3");
		});
		
		$("#right").mousedown(function(){
			ws.send("command-4");
		});
		
		$("#forward, #backward, #left, #right").mouseup(function(){
			ws.send("command-0");
		});
		
		self.ws = ws;
		// gamepade support
		gamepadSupport.init();
		
	};
	
	self.moveRobot = function(upDown, leftRight){
		
		// forward
		if(self.ws){
			
			if(upDown < 0){
				if(!self.robotIsMoving){
					self.ws.send("command-1");
					self.robotIsMoving = true;
					console.log("dopredu");
				}
				
			// backward
			}else if(upDown > 0){
				if(!self.robotIsMoving){
					self.ws.send("command-2");
					self.robotIsMoving = true;
					console.log("dozadu");
				}
				
			}else if(leftRight < 0){
				if(!self.robotIsMoving){
					self.ws.send("command-3");
					self.robotIsMoving = true;
					console.log("vlevo");
				}
				
			// right
			}else if(leftRight > 0){
				if(!self.robotIsMoving){
					self.ws.send("command-4");
					self.robotIsMoving = true;
					console.log("vpravo");
				}
				
			}else{
				if(self.robotIsMoving){
					self.ws.send("command-0");
					self.robotIsMoving = false;
					console.log("stop");
				}
				
			}
		}
		
	};
	
	var gamepadSupport = {
			TYPICAL_BUTTON_COUNT : 16,
			TYPICAL_AXIS_COUNT : 4,
			ticking : false,
			gamepads : [],
			prevRawGamepadTypes : [],
			prevTimestamps : [],
			init : function() {
				var gamepadSupportAvailable = !!navigator.webkitGetGamepads
						|| !!navigator.webkitGamepads
						|| (navigator.userAgent.indexOf('Firefox/') != -1);
				if (!gamepadSupportAvailable) {

				} else {
					window.addEventListener('MozGamepadConnected',
							gamepadSupport.onGamepadConnect, false);
					window.addEventListener('MozGamepadDisconnected',
							gamepadSupport.onGamepadDisconnect, false);
					if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
						gamepadSupport.startPolling();
					}
				}
			},
			onGamepadConnect : function(event) {
				gamepadSupport.gamepads.push(event.gamepad);
				console.log("connected new device " + event);
				gamepadSupport.startPolling();
			},
			onGamepadDisconnect : function(event) {
				for ( var i in gamepadSupport.gamepads) {
					if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
						gamepadSupport.gamepads.splice(i, 1);
						break;
					}
				}
				if (gamepadSupport.gamepads.length == 0) {
					gamepadSupport.stopPolling();
				}
			},
			startPolling : function() {
				if (!gamepadSupport.ticking) {
					gamepadSupport.ticking = true;
					gamepadSupport.tick();
				}
			},
			stopPolling : function() {
				gamepadSupport.ticking = false;
			},
			tick : function() {
				gamepadSupport.pollStatus();
				gamepadSupport.scheduleNextTick();
			},
			scheduleNextTick : function() {
				if (gamepadSupport.ticking) {
					if (window.requestAnimationFrame) {
						window.requestAnimationFrame(gamepadSupport.tick);
					} else if (window.mozRequestAnimationFrame) {
						window.mozRequestAnimationFrame(gamepadSupport.tick);
					} else if (window.webkitRequestAnimationFrame) {
						window.webkitRequestAnimationFrame(gamepadSupport.tick);
					}
				}
			},
			pollStatus : function() {
				gamepadSupport.pollGamepads();
				for ( var i in gamepadSupport.gamepads) {
					var gamepad = gamepadSupport.gamepads[i];
					if (gamepad.timestamp
							&& (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
						continue;
					}
					gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
					gamepadSupport.updateDisplay(i);
				}
			},
			pollGamepads : function() {
				var rawGamepads = (navigator.webkitGetGamepads && navigator
						.webkitGetGamepads())
						|| navigator.webkitGamepads;
				if (rawGamepads) {
					gamepadSupport.gamepads = [];
					var gamepadsChanged = false;
					for ( var i = 0; i < rawGamepads.length; i++) {
						if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
							gamepadsChanged = true;
							gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
						}
						if (rawGamepads[i]) {
							gamepadSupport.gamepads.push(rawGamepads[i]);
						}
					}
					if (gamepadsChanged) {
						
					}
				}
			},
			updateDisplay : function(gamepadId) {
				var gamepad = gamepadSupport.gamepads[gamepadId];
				
				var upDown = gamepad.axes[1];
				var leftRight = gamepad.axes[0];
				
				self.moveRobot(upDown, leftRight);
				
				var extraButtonId = gamepadSupport.TYPICAL_BUTTON_COUNT;
				while (typeof gamepad.buttons[extraButtonId] != 'undefined') {

					extraButtonId++;
				}
				var extraAxisId = gamepadSupport.TYPICAL_AXIS_COUNT;
				while (typeof gamepad.axes[extraAxisId] != 'undefined') {

					extraAxisId++;
				}
			}
		};
}