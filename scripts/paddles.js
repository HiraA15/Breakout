Breakout.Paddle = (function() 
{
	'use strict';

	var that = {};
	var startPos = {
		x: 384,
		y: 450
	};
	var currentPos = startPos;
	var VELOCITY = 0.5;
	var width = CANVAS_WIDTH * 0.15;
	var height = 7;
	var leftFriction = false;
	var rightFriction = false;

	function moveLeft(elapsedTime) 
	{
		currentPos = 
		{
			x: currentPos.x - (VELOCITY * elapsedTime),
			y: currentPos.y
		};
		if (currentPos.x < 0) 
		{
			currentPos.x = 0;
		}
		leftFriction = true;
	}

	function moveRight(elapsedTime) 
	{
		currentPos = 
		{
			x: currentPos.x + (VELOCITY * elapsedTime),
			y: currentPos.y
		};
		if (currentPos.x + width > CANVAS_WIDTH) 
		{
			currentPos.x = CANVAS_WIDTH - width;
		}
		rightFriction = true;
	}

	that.shrinkBy = function(percent) 
	{
		width = (width * (1 - percent));
	}

	that.resetSize = function() 
	{
		width = CANVAS_WIDTH * 0.15;
	}

	that.getCenter = function() 
	{
		return {
			x: currentPos.x + width / 2,
			y: currentPos.y + height / 2
		}
	}

	that.update = function(elapsedTime, ball) 
	{
		var ballPos = ball.getAABB();
		if (GameUtil.intersectsWith({
				x: currentPos.x,
				y: currentPos.y,
				width: width,
				height: height * 0.5
			}, {
				x: ballPos.x,
				y: ballPos.y,
				width: ballPos.width * 0.5,
				height: ballPos.height * 0.5
			})) {
			ball.vY = -Math.abs(ball.vY);

			ball.vX = 7 * 
				((ballPos.x + ballPos.width / 2) - (currentPos.x + width / 2)) / width;

			if (leftFriction) {
				ball.vX -= 3;
			}

			if (rightFriction) {
				ball.vX += 3;
			}
		}

		leftFriction = false;
		rightFriction = false;
	}

	that.render = function(elapsedTime, ctx) 
	{
		ctx.fillStyle = '#555555';
		ctx.fillRect(currentPos.x, currentPos.y, width, height);
	}

	Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_LEFT, moveLeft);
	Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_RIGHT, moveRight);

	return that;
}());
