Breakout.BrickFactory = (function() 
{
	'use strict';

	var cellPadding = 1;
	var GREEN = '#009D00';
	var BLUE = '#0051BA';
	var ORANGE = '#FF8811';
	var YELLOW = '#FFDE24';

	function Brick(spec) 
	{
		var that = {};
		var ready = false;
		var destroyed = false;

		that.update = function(elapsedTime, ball) 
		{
			var ballPos = ball.getAABB();
			if (!destroyed && GameUtil.intersectsWith({
				x:spec.x - cellPadding,
				y:spec.y - cellPadding,
				width:spec.width + cellPadding,
				height:spec.height + cellPadding
			}, ballPos)) {
				destroyed = true;
				for (var j = 0; j < spec.height; ++j) 
				{
					for (var i = 0; i < spec.width; ++i) 
					{
						Breakout.ParticleSystem.create({
							center: {x: spec.x + i, y: spec.y + j},
							width: spec.width,
							height: spec.height
						});		
					}
				}

				if (spec.color == YELLOW) Breakout.Scoring.addPoints(1);
				if (spec.color == ORANGE) Breakout.Scoring.addPoints(2);
				if (spec.color == BLUE) Breakout.Scoring.addPoints(3);
				if (spec.color == GREEN) Breakout.Scoring.addPoints(5);

				if (ball.vY <= 0 && ballPos.y + ballPos.height / 2 >= spec.y + spec.height) 
				{
					ball.vY = Math.abs(ball.vY);
				}
				else if (ball.vY >= 0 && ballPos.y + ballPos.height / 2 <= spec.y) 
				{
					ball.vY = -Math.abs(ball.vY);
				}
				else if (ball.vX >= 0 && ballPos.x + ballPos.width / 2 <= spec.x) 
				{
					ball.vX = -Math.abs(ball.vX);
				}
				else if (ball.vX <= 0 && ballPos.x + ballPos.width / 2 >= spec.x + spec.width) 
				{
					ball.vX = Math.abs(ball.vX);
				}
				else 
				{
					ball.vY = -ball.vY;
				}
			}
		}

		that.onload = function() 
		{
			ready = true;
		}

		that.isDestroyed = function() 
		{
			return destroyed;
		}

		that.getOrigin = function() 
		{
			return {
				x: spec.x,
				y: spec.y,
			}
		}

		that.draw = function(context) 
		{
			if (destroyed === false) 
			{
				context.save();
				context.fillStyle =
					spec.color;
				context.fillRect(
					spec.x, spec.y,
					spec.width, spec.height
				);
				context.restore();
			}
		}

		return that;
	}

	function Level(spec) 
	{
		var numRows = 8;
		var numCols = 16;
		var cellWidth = spec.width / numCols;
		var cellHeight = 14;
		var bricks = [];
		var color = "#FFFFFF";

		for (var j = 0; j < numRows; ++j) 
		{
			for (var i = 0; i < numCols; ++i) 
			{
				if (j <= 1) color = GREEN;
				if (j > 1 && j <= 3) color = BLUE;
				if (j > 3 && j <= 5) color = ORANGE;
				if (j > 5) color = YELLOW;

				bricks.push(Brick({
					x: i * cellWidth + cellPadding,
					y: j * cellHeight + cellPadding + spec.height / 4,
					width: cellWidth - 2 * cellPadding,
					height: cellHeight - 2 * cellPadding,
					color: color
				}));
			}
		}

		return {
			bricks: bricks,
			width: numCols,
			height: numRows
		};
	}

	return {
		Brick: Brick,
		Level: Level
	}
})
