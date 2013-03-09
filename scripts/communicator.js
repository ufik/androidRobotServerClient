function Communicator(){
	var self = this;
	
	self.ws = null;
	// promenne pro monitoring prenosu
	self.connected = false;
	self.totalReceived = 0;
	self.actualReceived = 0;
	self.averagePerSecond = 0;
	self.ping = 0;
	self.distance = 0;
	
	self.startTime = new Date().getTime();
	
	self.init = function(){
		if ("WebSocket" in window) {

			  self.ws = new WebSocket("ws://localhost:1338");
			  
			  /**
			   * Callback po navazani spojeni se serverem.
			   */
			  self.ws.onopen = function() {
			    // Websocket je připojen.
			    console.log("Spojeni navazano.");
			    self.connected = true;
			    $("#loader").removeClass("active");
			    
			    // inicializace ovladani, vizualni, klavesnice nebo herni ovladac
			    var controller = new Controller();
				controller.init(self.ws);
			  };
			  
			  /**
			   * Callback po prijeti zpravy od serveru.
			   */
			  self.ws.onmessage = function (evt) {	 
			   
			   if(evt.data != "robot disconnect" && evt.data != "robot connect"){
				   if(evt.data.length > 0){
					   if(evt.data.length < 10){
						   
						   if(evt.data.indexOf("#") != -1)
							   self.distance = evt.data.substr(1, evt.data.length); 
						   else{
							   self.totalReceived += parseInt(evt.data);
							   self.actualReceived = parseInt(evt.data);
						   }
					   }
					   else
						   $("#image").attr("src", "data:image/jpeg;base64," + evt.data);
				   }
			   }else{
				   if(evt.data == "robot disconnect"){
					   self.connected = false;
					   $("#loader").addClass("active");
				   }else{
					   self.resetData();
					   self.connected = true;
					   $("#loader").removeClass("active");
				   }
			   }
			   
			   self.refreshMonitor();
			  };
			  
			  self.ws.onclose = function() { 
				  // websocket je zavřen. 
				  console.log("Spojeni uzavreno.");
				  self.connected = false;
			  };
				  
		} else {
		    // prohlížeč nepodporuje Websockets.
			console.log("WebSocket neni podporovan.");
		}
		
		self.refreshMonitor();
	};
	
	self.resetData = function(){
		self.totalReceived = 0;
		self.actualReceived = 0;
		self.averagePerSecond = 0;
		self.startTime = new Date().getTime();
	};
	
	self.isConnected = function(){
		return self.connected;
	};
	
	self.refreshMonitor = function(){
		
		if(self.isConnected())
			$("#conStatus").html('Připojen');
		else
			$("#conStatus").html('Odpojen');
			
		$("#total").html(self.formatBytes(self.totalReceived));
		$("#bitrate").html(self.formatBytes(self.totalReceived / ((new Date().getTime() - self.startTime) / 1000)) + "/s");
		$("#ping").html(self.ping);
		$("#timeElapsed").html((new Date().getTime() - self.startTime) / 1000);
		
		if(self.distance > 170)
			$("#distance").html("> 170cm");
		else
			$("#distance").html(self.distance + "cm");
		
	};
	
	self.formatBytes = function(bytes){
		if(bytes < 1000000){
			return Math.round((bytes / 1024) * 100) / 100 + "KB";
		}else{
			return Math.round((bytes / 1024 / 1024) * 100) / 100 + "MB";
		}
	};
}