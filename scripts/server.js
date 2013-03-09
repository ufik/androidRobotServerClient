var WebSocketServer = require('websocket').server;
var http = require('http');

var net = require('net');

var ffmpeg = require('fluent-ffmpeg');

var buffer = "";
var robotSocket;

// communication canal
var server = net.createServer(function(socket){

	robotSocket = socket;
	console.log("Robot pripojen.");
	if(client != null) client.send("robot connect");
	
	socket.on('data', function(data){
		
		if(client != null){
			client.send("#" + parseInt(data.toString('hex'), 16));
		}

	});
	
	socket.on('close', function(connection){
		console.log("Robot odpojen");
		robotSocket = null;
		if(client != null) client.send("robot disconnect");
	});
});

server.listen(1330);

// prijem video streamu
var server = net.createServer(function(socket){

	robotSocket = socket;
	console.log("Robot pripojen.");
	//client.send("robot connect");
	
	socket.on('data', function(data){
		
		if(stream != null){
			console.log("streaming at " + new Date());
			stream.write(data);
		}
		
		broadcastJpegSequence(data);
		

	});
	
	socket.on('close', function(connection){
		console.log("Robot odpojen");
		robotSocket = null;
		//client.send("robot disconnect");
	});
});

server.listen(1337);

var stream = null;
var server = net.createServer(function(socket){
	
	stream = socket;
	
	console.log("ffmpeg pripojen");
	socket.on('data', function(data){
		console.log(data);

	});
	
	socket.on('close', function(connection){
		console.log("ffpmeg odpojen");
		stream = null;
		//client.send("robot disconnect");
	});
});

server.listen(1339);

function strpos (haystack, needle, offset) {
	  var i = (haystack + '').indexOf(needle, (offset || 0));
	  return i === -1 ? false : i;
	}

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
	client = request.accept(null, request.origin);
	
	
});

server.listen(1338);

// streamovani klientovi
wsServer = new WebSocketServer({
    httpServer: server
});
var client = null;
// WebSocket server
wsServer.on('request', function(request) {
    client = request.accept(null, request.origin);
    
    console.log("Klient pripojen.");
    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    client.on('message', function(message) {
    	console.log("Zprava pro robota " + message.utf8Data);
    	if(typeof robotSocket != "undefined"){
    		if(robotSocket != null) robotSocket.write(message.utf8Data);
    	}
        
    });

    client.on('close', function(connection) {
    	console.log("Klient odpojen.");
    });
});

function broadcastJpegSequence(data){
	// naplneni bufferu pro obrazky
	buffer += data.toString("hex");
	//console.log(buffer);
	var firstIndex = strpos(buffer, "ffd8ffe0");
	var secondIndex = strpos(buffer, "ffd8ffe0", firstIndex+1);

	if(firstIndex !== false && secondIndex !== false){
		
		image = buffer.substr(firstIndex, secondIndex);
		buffer = buffer.substr(secondIndex, buffer.length);
		
		// odesilani video streamu klientovi
		if(typeof client != "undefined" && client != null){
			
			client.send(new Buffer(image, 'hex').length);
			client.send(new Buffer(image, 'hex').toString("base64"));
		}
	}
}

// UDP.
var dgram = require("dgram");

var server = dgram.createSocket("udp4", function(socket){
	
});

var address;
var port;
server.on("message", function (data, rinfo) {
  
	broadcastJpegSequence(data);
	
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(1400);

console.log("Listening on port 1337 and 1338");