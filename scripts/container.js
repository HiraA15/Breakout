Breakout.Storage = (function() 
{
	var that = {};
	var highScores = [];
	var previousScores = localStorage.getItem('Breakout.highScores');
	if (previousScores !== null) 
	{
		highScores = JSON.parse(previousScores);
	}

	that.saveScore = function(score) 
	{
		highScores.push(parseInt(score));
		highScores.sort(function(a, b){return b - a;});
		highScores = highScores.splice(0, 5);
		console.log(highScores);
		localStorage['Breakout.highScores'] = JSON.stringify(highScores);
	}

	that.getHighScores = function() 
	{
		return highScores;
	}
	return that;
}());
