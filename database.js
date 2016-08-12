const mongoose = require('mongoose');
const config = require('./config.json');

function connectToDatabase(callback, isTests)
{
	mongoose.Promise = Promise;

	if (!isTests)
	{
		mongoose.connect(config.database, function(err)
		{
			callback(err);
		});
		return;
	}

	mongoose.connect(config['test-database'], function(err)
	{
		mongoose.connection.db.dropDatabase();
		callback(err);
		return;
	});
}

module.exports = connectToDatabase;
