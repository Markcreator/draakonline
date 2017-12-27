$(function() {	
	var jc = $("#fancybg");
	var c = jc[0];
	c.width = jc.width();
	c.height = jc.height();
	
	var ctx = c.getContext("2d");
	
	//Resize
	$(window).on('resize.fancybg', resizeFancybg);
	function resizeFancybg() {
		if(jc.is(":visible")) {
			c.width = jc.width();
			c.height = jc.height();
			loadPoints();
		}
	}
	resizeFancybg();
	
	//Classes
	function Vector2(x, y) {
		this.x = x;
		this.y = y;
	}
	Vector2.prototype.copy = function() {
		return new Vector2(this.x, this.y);
	}
	Vector2.prototype.add = function(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}
	Vector2.prototype.remove = function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}
	Vector2.prototype.multiply = function(f) {
		this.x *= f;
		this.y *= f;
		return this;
	}

	function Point(pos, vel, size) {
		this.pos = pos;		
		this.vel = vel;
		this.size = size;
		this.displacement = new Vector2(0, 0);
	}
	
	function dist(pos1, pos2) {
		var a = pos1.x - pos2.x;
		var b = pos1.y - pos2.y;

		return Math.sqrt( a*a + b*b );
	}
	
	//Canvas
	var fps = 60;
	var pointArray = [];
	var amount;
	var maxSpeed = 2;
	var minSize = 2;
	var maxSize = 4;
	var maxDistance = 100;
	var color = "255, 255, 255";
	var lineColor = "200, 200, 200";
	
	function loadPoints() {
		pointArray = [];
		amount = 10 + (c.width*c.height)*0.00008*2;
		
		for(var i = 0; i < amount; i++) {
			var pos = new Vector2(Math.floor(Math.random() * c.width), Math.floor(Math.random() * c.height));
			var vel = new Vector2(Math.random() * maxSpeed - (maxSpeed/2), Math.random() * maxSpeed - (maxSpeed/2));
			var size = (Math.random() * (maxSize-minSize)) + minSize;
			
			var point = new Point(pos, vel, size);
			pointArray.push(point);
		}
	}
	loadPoints();
	
	function renderCanvas() {
		ctx.clearRect(0, 0, c.width, c.height);
		updatePoints();
		renderLines();
		renderPoints();
	}
	
	function updatePoints() {
		for(var i = 0; i < pointArray.length; i++) {
			var point = pointArray[i];
			
			point.pos.add(point.vel);
			if(point.pos.y < 0 || point.pos.y > c.height) {
				point.vel.y *= -1;
			}
			if(point.pos.x < 0 || point.pos.x > c.width) {
				point.vel.x *= -1;
			}
		}
	}
	
	function renderPoints() {
		for(var i = 0; i < pointArray.length; i++) {
			var point = pointArray[i];
			var pointRenderPos = point.pos.copy().add(point.displacement);

			ctx.beginPath();
			ctx.arc(pointRenderPos.x, pointRenderPos.y, point.size, 0, 2*Math.PI);
			ctx.fillStyle = "rgb(" + color + ")";
			ctx.fill();
		}
	}
	
	function renderLines() {
		for(var i = 0; i < pointArray.length; i++) {
			var point = pointArray[i];
			var pointRenderPos = point.pos.copy().add(point.displacement);
			
			for(var o = 0; o < pointArray.length; o++) {
				var point2 = pointArray[o];
				var point2RenderPos = point2.pos.copy().add(point2.displacement);
				
				var distance = dist(pointRenderPos, point2RenderPos);
				if(distance < maxDistance) {
					ctx.beginPath();
					ctx.moveTo(pointRenderPos.x, pointRenderPos.y);
					ctx.lineTo(point2RenderPos.x, point2RenderPos.y);
					ctx.strokeStyle = "rgba(" + lineColor + ", " + (1.0-(distance/maxDistance)) + ")";
					ctx.stroke();
				}
			}
		}
	}
	
	setInterval(function() {
		renderCanvas();
	}, 1000/fps);
	
	//Displacement
	var displacementFactor = 5;
	var displacementSizeFactor = 2.5;
		
	$("#carousel").mousemove(function(e) {
		var evt = e || event;
				
		var displacement = new Vector2(e.clientX, e.clientY); // Mouse pos
		//To percentage in screen
		displacement.x = (displacement.x/$(window).width())-0.5;
		displacement.y = (displacement.y/$(window).height())-0.5;
		
		var newDisplacement = new Vector2(displacement.x, displacement.y).multiply(displacementFactor);
		for(var i = 0; i < pointArray.length; i++) {
			var point = pointArray[i];
			
			point.displacement = newDisplacement.copy().multiply(point.size**displacementSizeFactor);
		}
	});
});