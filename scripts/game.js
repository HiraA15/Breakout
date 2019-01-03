Breakout.screens['game'] = (function(Keyboard, Paddle, Ball, Scores, Menu, Particles) 
{
	'use strict';

	var lastTimestamp = performance.now();
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var level, levelData;
	var bricksDestroyed, rowsDestroyed;
	var speedLevel;
	var rowBonuses;
	var topRowHit, paddleShrunk;
	var lives;
	var balls, maxBalls;

	var paused = false;

	function displayScore(context) 
	{
		context.fillStyle = '#990033';
		context.font = '16px Arial';
		context.textAlign = 'right';
		context.fillText('Score:', canvas.width - 35, canvas.height - 8);
		context.textAlign = 'left';
		context.fillText(Scores.getScore(), canvas.width - 30, canvas.height - 8);
	}

	function displayLives(context) 
	{
		context.fillStyle = '#990033';
		context.font = '16px Arial';
		context.textAlign = 'right';
		context.fillText('Lives:', 50, canvas.height - 8);

		context.fillStyle = '#555555';

		for (var i = lives - 1; i >= 0; i--) 
		{
			context.fillRect(55 + (i * 40), canvas.height - 16, 32, 7);
		}
	}

	function countdown() 
	{
		var oldSpeedLevel = speedLevel;
		speedLevel = 0;
		Breakout.screens['menu'].countdown();
		window.setTimeout(function() 
		{
			speedLevel = oldSpeedLevel;
			paused = false
		}, 4000);
		window.setTimeout(function() 
		{
			newBall();
			requestAnimationFrame(gameLoop);
		}, 4000);
	}

	function newBall() 
	{
		balls.push(Ball.Ball({
			x: Paddle.getCenter().x,
			y: Paddle.getCenter().y + 2,
			vX: 0,
			vY: -3
		}));
	}

	function update(elapsedTime) 
	{
		Keyboard.update(elapsedTime);
		Breakout.ParticleSystem.update(elapsedTime);

		if (maxBalls < (Scores.getScore() / 100)) 
		{
			maxBalls++;
			newBall();
		}

		for (var i = balls.length - 1; i >= 0; i--) 
		{
			for (var j = levelData.length - 1; j >= 0; j--) 
			{
				levelData[j].update(elapsedTime, balls[i]);
			}
			Paddle.update(elapsedTime, balls[i]);
			balls[i].update(elapsedTime, canvas, speedLevel);
		}

		var numBricksInRowDestroyed = 0;
		rowsDestroyed = 0;
		bricksDestroyed = 0;
		for (var j = 0; j < level.height; ++j) 
		{
			numBricksInRowDestroyed = 0;
			for (var i = 0; i < level.width; ++i) 
			{
				if (j == 0 && levelData[(j * level.width + i)].isDestroyed()) 
				{
					topRowHit = true;
				}
				if (levelData[(j * level.width + i)].isDestroyed()) 
				{
					numBricksInRowDestroyed++;
					bricksDestroyed++;
				}
			}
			if (numBricksInRowDestroyed >= level.width) rowsDestroyed++;
		}
		if (rowsDestroyed > rowBonuses) 
		{
			Scores.addPoints(25);
			++rowBonuses;
		}
		if (topRowHit && !paddleShrunk) 
		{
			Paddle.shrinkBy(0.5);
			paddleShrunk = true;
		}

		if (bricksDestroyed > 4) 
		{
			speedLevel = 1.2;
		}
		if (bricksDestroyed > 12) 
		{
			speedLevel = 1.4;
		}
		if (bricksDestroyed > 36) 
		{
			speedLevel = 1.6;
		}
		if (bricksDestroyed > 62) 
		{
			speedLevel = 2;
		}

		balls = balls.filter(function(element) 
		{
			return !element.dead;
		});

		if (balls.length == 0) 
		{
			--lives;
			paused = true;
			if (lives > 0) 
			{
				countdown();
			}
			else 
			{
				Breakout.Storage.saveScore(Scores.getScore());
				Scores.resetScore();
				Breakout.main.showScreen('menu');
			}
		}

		return;
	}

	function render(elapsedTime) 
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		Paddle.render(elapsedTime, context);
		Breakout.ParticleSystem.render(context);
		for (var i = levelData.length - 1; i >= 0; i--) 
		{
			levelData[i].draw(context);
		}
		for (var i = balls.length - 1; i >= 0; i--) 
		{
			balls[i].render(elapsedTime, context);
		}
		displayScore(context);
		displayLives(context);
	}

	function gameLoop(currentTime) 
	{
		var elapsedTime = (currentTime - lastTimestamp);
		lastTimestamp = currentTime;

		update(elapsedTime);
		render(elapsedTime);

		if (!paused) 
		{
			requestAnimationFrame(gameLoop);
		}
		return;
	}

	function run() 
	{
		paused = false;
		requestAnimationFrame(gameLoop);
	}

	function initialize() 
	{
		level = Breakout.BrickFactory().Level(canvas);
		levelData = level.bricks;
		bricksDestroyed = 0;
		rowsDestroyed = 0;
		speedLevel = 1;
		rowBonuses = 0;
		topRowHit = false;
		paddleShrunk = false;
		lives = 4;
		balls = [];
		maxBalls = 1;
		Paddle.resetSize();

		paused = true;

		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	return {
		initialize: initialize,
		run: run
	}

}(Breakout.KeyboardHandler, Breakout.Paddle, Breakout.BallFactory, Breakout.Scoring, Breakout.Menu, 
	Breakout.ParticleSystem));
