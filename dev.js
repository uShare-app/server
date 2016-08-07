require('colors');
const nodemon = require('nodemon');

nodemon(
{
	script: 'prod.js',
	ext: 'js json'
});

let first;

first = 1;
nodemon.on('start', function()
{
	if (first)
	{
		console.log('Uplimg\'s server started in development mode.'.yellow);
		first = 0;
	}
});

nodemon.on('quit', function()
{
	console.log('Exiting Uplimg\'s server.'.yellow);
	process.exit(0);
});

nodemon.on('restart', function(files)
{
	console.log('Uplimg\'s server restarted due to:'.yellow, files);
});