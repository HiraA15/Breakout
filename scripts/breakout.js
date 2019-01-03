var Breakout = 
{
	screens: {}
};

var CANVAS_WIDTH = 768;
var CANVAS_HEIGHT = 480;

Breakout.main = (function(screens) 
{
	'use strict';

	function showScreen(id) 
	{
		console.log(screens);
		screens[id].run();
	}

	function initialize() 
	{
		for (screen in screens) 
		{
			if (screens.hasOwnProperty(screen)) 
			{
				screens[screen].initialize();
			}
		}

		showScreen('menu');
	}

	return {
		showScreen: showScreen,
		initialize: initialize
	}
}(Breakout.screens));
