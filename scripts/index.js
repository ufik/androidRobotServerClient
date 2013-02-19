$(function(){
	
	// komunikace se serverem
	communicator = new Communicator();
	communicator.init();
	
	// obsluha designu aplikace
	function afterResize(){
		$("#main").height($(window).height() - 102);
		$("aside").height($(window).height() - 102);
		//$("img").width($(window).width() - 201);
		$("img").height($(window).height() - 102);
		$("img").css("margin-left", ($(window).height() - parseInt($("img").css("width"))) / 2 + "px");
	}
	
	afterResize();
	
	$(window).resize(function(){
		afterResize();
	});
});