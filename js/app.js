$(function() {
	// Plugin initializing
	$('.carousel.carousel-slider').carousel({fullWidth: true});
	$('.tooltipped').tooltip();
	
	// Carousel event prevention workaround
	$('a').on('touchstart', function(e) {
		e.preventDefault();
		window.location = this.href;
	});
	
	// Carousel resizing
	$(window).on('resize.carousel', resizeCarousel);
	function resizeCarousel() {
		$(".carousel").height($(window).height());
	}
	resizeCarousel();
	
	// Keyboard navigation
	$(document).keypress(function(e) {		
		if(e.keyCode == 37) {
			$(".carousel").carousel("prev");
		}
		if(e.keyCode == 39) {
			$(".carousel").carousel("next");
		}
	});
	
	// Swiping
	var startX;
	var startY;
	var threshold = 50;
	
	$(".carousel").on("touchstart mousedown", function(e) {
		startX = e.pageX;
		startY = e.pageY;
	});
	$(".carousel").on("touchend mouseup", function(e) {
		var dx = e.pageX - startX;
		var dy = e.pageY - startY;
		
		if(Math.abs(dx) >= threshold) {
			var left = dx > 0;
			
			$(this).carousel(left ? "prev" : "next");
		}
	});
});