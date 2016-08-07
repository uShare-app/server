require('colors');
const config = require('./config.json');

const version = '0.0.1';

console.log('Welcome to Uplimg\'s server.\nVersion:'.green, version.green);

require('./database')(function(err)
{
	if (!err)
	{
		console.log(`Connected to MongoDB at ${config.database}.`.green);
		require('./routes')(function(err)
		{
			err; // err not implemented yet
			console.log(`Listening on port ${config.port}.`.green);
		});
	}
	else
	{
		console.log(`Cannot connect to Mongodb at ${config.database}. Check the documentation for help.`.red);
		process.exit(1);
		return;
	}
});