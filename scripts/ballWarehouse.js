Breakout.BallFactory = (function()
{
	'use strict';

	function Ball(spec) 
	{

		var that = {};
		that.x = spec.x;
		that.y = spec.y;
		that.vX = spec.vX;
		that.vY = spec.vY;
		that.diameter = 8;

		that.render = function(elapsedTime, context) 
		{
			context.fillStyle = "#FFFFFF";
			context.beginPath();
			context.arc(that.x, that.y, that.diameter / 2, 0, 2*Math.PI);
			context.closePath();
			context.fill();

			return;
		}

		that.getAABB = function() 
		{
			return {
				x: that.x,
				y: that.y,
				width: that.diameter,
				height: that.diameter
			}
		}

		that.update = function(elapsedTime, canvas, speedLevel) 
		{
			that.x = that.x + that.vX;
			that.y = that.y + that.vY * speedLevel;

			if (that.x - that.diameter / 2 < 0) 
			{
				that.x = 0 + that.diameter / 2;
				that.vX = -that.vX;
			}
			if (that.y - that.diameter / 2 < 0) 
			{
				that.y = 0 + that.diameter / 2;
				that.vY = -that.vY;
			}
			if (that.x + that.diameter / 2 > canvas.width) 
			{
				that.x = canvas.width - that.diameter / 2;
				that.vX = -that.vX;
			}
			if (that.y + that.diameter / 2 > canvas.height) 
			{
				that.dead = true;
				return;
			}
		}
		return that;
	}
	return {
		Ball: Ball
	}
}());