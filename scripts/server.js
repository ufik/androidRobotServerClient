var WebSocketServer = require('websocket').server;
var http = require('http');

var net = require('net');

var buffer = "";
var robotSocket;

// prijem video streamu
var server = net.createServer(function(socket){

	robotSocket = socket;
	console.log("Robot pripojen.");
	
	socket.on('data', function(data){
		
		// naplneni bufferu pro obrazky
		buffer += data.toString("hex");
		//console.log(buffer);
		var firstIndex = strpos(buffer, "ffd8ffe0");
		var secondIndex = strpos(buffer, "ffd8ffe0", firstIndex+1);

		if(firstIndex !== false && secondIndex !== false){
			
			image = buffer.substr(firstIndex, secondIndex);
			buffer = buffer.substr(secondIndex, buffer.length);
			
			// odesilani video streamu klientovi
			if(typeof client != "undefined"){

				client.send(new Buffer(image, 'hex').toString("base64"));
			}
		}

	});
	
	socket.on('close', function(connection){
		console.log("Robot odpojen");
	});
});

server.listen(1337);

function strpos (haystack, needle, offset) {
	  var i = (haystack + '').indexOf(needle, (offset || 0));
	  return i === -1 ? false : i;
	}

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
	
});

server.listen(1338);

// streamovani klientovi
wsServer = new WebSocketServer({
    httpServer: server
});
var client;
// WebSocket server
wsServer.on('request', function(request) {
    client = request.accept(null, request.origin);
    
    console.log("Klient pripojen.");
    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    client.on('message', function(message) {
    	console.log("Zprava pro robota " + message.utf8Data);
    	if(typeof robotSocket != "undefined"){
    		robotSocket.write(message.utf8Data);
    	}
        
    });

    client.on('close', function(connection) {
    	console.log("Klient odpojen.");
    });
});

console.log("Listening on port 1337 and 1338");