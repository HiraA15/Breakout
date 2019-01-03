Breakout.ParticleSystem = (function()
{
	var that = {};
	var particles = {};
	var nextID = 1;

	that.render = function(context) 
	{
		var particle;
		var value;

		for (value in particles) 
		{
			if (particles.hasOwnProperty(value)) 
			{
				particle = particles[value];
				context.fillStyle = '#DDDDDD';
				context.fillRect(particle.center.x, particle.center.y, 
					2, 2);
			}
		}
	}

	that.create = function(spec) 
	{
		var p = {
				size: {width: 2, height: 2},
				center: {x: spec.center.x, y: spec.center.y},
				direction: {vX: Math.random() - 0.5, vY: 1},
				speed: spec.center.y * 0.02 * Math.random(),
				rotation: 0,
				lifetime: 1,
				alive: 0
			};
		particles[nextID++] = p;
	};

	that.update = function(elapsedTime) 
	{
		var removeMe = [],
			value,
			particle;
			
		elapsedTime = elapsedTime / 1000;
		
		for (value in particles) 
		{
			if (particles.hasOwnProperty(value)) 
			{
				particle = particles[value];
				particle.alive += elapsedTime;
				particle.center.x += (elapsedTime * particle.speed * particle.direction.vX);
				particle.center.y += (elapsedTime * particle.speed * particle.direction.vY);
				particle.rotation += particle.speed / 500;
				
				if (particle.alive > particle.lifetime) 
				{
					removeMe.push(value);
				}
			}
		}

		for (particle = 0; particle < removeMe.length; particle++) 
		{
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
	};

	return that;
}());
