Breakout.screens['menu'] = (function() 
{
	'use strict';

	var that = {};
	var lastTimestamp = performance.now();
	var menuOptions;
	var currentOption;
	var menuCanvas = document.getElementById('menu');
	var menuContext = menuCanvas.getContext('2d');
	var paused, skipRender;
	var timeoutIDs = [];

	that.getContext = function() 
	{
		return menuContext;
	}

	that.initialize = function() 
	{
		menuOptions = 0;
		currentOption = 0;
		paused = true;
		skipRender = false;

		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
	}

	that.run = function() 
	{
		paused = false;
		skipRender = false;
		that.showMainMenu();
	}

	function menuUp() 
	{
		if (currentOption > 0) 
		{
			--currentOption;
			Breakout.KeyboardHandler.unregisterCommand(KeyEvent.DOM_VK_UP);
			timeoutIDs.push(window.setTimeout(function() 
			{
				Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_UP, menuUp);
			}, 200));

		}
	}

	function menuDown() 
	{
		if (currentOption < menuOptions.length - 1) 
		{
			++currentOption;
			Breakout.KeyboardHandler.unregisterCommand(KeyEvent.DOM_VK_DOWN);
			timeoutIDs.push(window.setTimeout(function() 
			{
				Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_DOWN, menuDown);
			}, 200));
		}
	}

	function menuSelect() 
	{
		menuOptions[currentOption]();
		Breakout.KeyboardHandler.unregisterCommand(KeyEvent.DOM_VK_RETURN);
		timeoutIDs.push(window.setTimeout(function() 
		{
			Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_RETURN, menuSelect);
		}, 500));
	}

	function newGame() 
	{
		paused = true;
		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		for (var i = timeoutIDs.length - 1; i >= 0; i--) 
		{
			window.clearTimeout(timeoutIDs[i]);
		}
		Breakout.KeyboardHandler.unregisterCommand(KeyEvent.DOM_VK_UP);
		Breakout.KeyboardHandler.unregisterCommand(KeyEvent.DOM_VK_DOWN);
		Breakout.KeyboardHandler.unregisterCommand(KeyEvent.DOM_VK_RETURN);
		Breakout.screens['game'].initialize();
		Breakout.main.showScreen('game');
	}

	function highScores() 
	{
		var scores = Breakout.Storage.getHighScores();
		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#eeccff';
		menuContext.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#990033';
		menuContext.textAlign = 'center';
		menuContext.font = '72px Arial';
		menuContext.fillText("High Scores", menuCanvas.width / 2, menuCanvas.height / 4);
		menuContext.textAlign = 'left';
		menuContext.font = '24px Courier New';
		for (var i = 0; i < scores.length; ++i) 
		{
			menuContext.fillText((i + 1) + '. ' + scores[i], menuCanvas.width / 2 - 50, 150 + i * 20);
		}
		menuContext.font = '24px Arial';
		menuContext.textAlign = 'left';
		menuContext.fillText("Back", menuCanvas.width / 2 - 20, 280);
		currentOption = 0;
		menuOptions = [that.run];
		requestAnimationFrame(menuLoop);	
	}

	function credits() 
	{
		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#eeccff';
		menuContext.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#990033';
		menuContext.textAlign = 'center';
		menuContext.font = '72px Arial';
		menuContext.fillText("Breakout", menuCanvas.width / 2, menuCanvas.height / 4);
		menuContext.font = '24px Arial';
		menuContext.fillText("Hira A, CS 5410", menuCanvas.width / 2, 
			menuCanvas.height / 2);
		menuContext.textAlign = 'left';
		menuContext.fillText("Back", menuCanvas.width / 2 - 20, 280);
		currentOption = 0;
		menuOptions = [that.run];
		requestAnimationFrame(menuLoop);
	}

	that.escape = function() {
		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#eeccff';
		menuContext.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#990033';
		menuContext.textAlign = 'center';
		menuContext.font = '72px Arial';
		menuContext.fillText("Breakout", menuCanvas.width / 2, menuCanvas.height / 4);
		menuContext.font = '24px Arial';
		menuContext.fillText("Hira A, CS 5410", menuCanvas.width / 2, 
			menuCanvas.height / 2);
		menuContext.textAlign = 'left';
		menuContext.fillText("Resume", menuCanvas.width / 2 - 20, 280);
		menuContext.fillText("Quit", menuCanvas.width / 2 - 20, 320);
		currentOption = 0;
		menuOptions = [runGame, that.run];
		requestAnimationFrame(menuLoop);
	}

	function runGame() 
	{
		Breakout.main.showScreen('game');
	}

	function update(elapsedTime) 
	{
		Breakout.KeyboardHandler.update(elapsedTime);
	}

	function render() 
	{
		menuContext.clearRect(0, 240, menuCanvas.width / 2 - 25, menuCanvas.height);
		menuContext.fillStyle = '#990033';
		menuContext.fillText('-', menuCanvas.width / 2 - 45, 280 + (40 * currentOption));
	}

	function menuLoop(currentTime) 
	{
		var elapsedTime = (currentTime - lastTimestamp);
		lastTimestamp = currentTime;

		update(elapsedTime);
		if (!skipRender) 
		{
			render();
		}

		if (!paused) 
		{
			requestAnimationFrame(menuLoop);
		}
	}

	that.showMainMenu = function() 
	{
		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#eeccff';
		menuContext.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#990033';
		menuContext.textAlign = 'center';
		menuContext.font = '72px Arial';
		menuContext.fillText("Breakout", menuCanvas.width / 2, menuCanvas.height / 4);
		menuContext.font = '24px Arial';
		menuContext.textAlign = 'left';
		menuContext.fillText("New Game", menuCanvas.width / 2 - 20, 280);
		menuContext.fillText("High Scores", menuCanvas.width / 2 - 20, 320);
		menuContext.fillText("Credits", menuCanvas.width / 2 - 20, 360);
		menuOptions = [newGame, highScores, credits];
		currentOption = 0;
		Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_UP, menuUp);
		Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_DOWN, menuDown);
		Breakout.KeyboardHandler.registerCommand(KeyEvent.DOM_VK_RETURN, menuSelect);
		requestAnimationFrame(menuLoop);
	}

	that.countdown = function() 
	{
		menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuContext.fillStyle = '#990033';
		menuContext.font = '74px Arial';
		menuContext.textAlign = 'center';
		window.setTimeout(function() {
			menuContext.fillText('3', canvas.width / 2, canvas.height / 2)
		}, 1000);
		window.setTimeout(function() {
			menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
		}, 1900);
		window.setTimeout(function() {
			menuContext.fillText('2', canvas.width / 2, canvas.height / 2)
		}, 2000);
		window.setTimeout(function() {
			menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
		}, 2900);
		window.setTimeout(function() {
			menuContext.fillText('1', canvas.width / 2, canvas.height / 2)
		}, 3000);
		window.setTimeout(function() {
			menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
		}, 3900);
	}
	return that;
}());
