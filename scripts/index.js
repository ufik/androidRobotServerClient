var imageView = new Array();
var reader = new FileReader();

var citac = 0;

$(function(){
	
	
	if ("WebSocket" in window) {

		  var ws = new WebSocket("ws://localhost:1338");
		  
		  ws.onopen = function() {
		    // Websocket je připojen. Teď lze posílat data pomocí metody send().
		    ws.send("zprava test");
		    console.log("Spojeni navazano.");
		    
		    var controller = new Controller();
			controller.init(ws);
		  };
		  
		  ws.onmessage = function (evt) {	 

		   if(evt.data.length > 0){ 
			   $("#image").attr("src", "data:image/jpeg;base64," + evt.data);
		   }

		  };
		  
		  ws.onclose = function() { 
			  // websocket je zavřen. 
			  console.log("Spojeni uzavreno.");
		  };
			  
		} else {
		  // prohlížeč nepodporuje Websockets.
			console.log("WebSocket neni podporovan.");
		}

});

$(function(){
	$("#show").click(function(){
		var oMyBlob = new Blob(imageView, { "type" : "image\/jpeg" });
		imageView = new Array();
		$("#image").attr("src", window.URL.createObjectURL(oMyBlob));
		console.log(oMyBlob);
	});
});