const mongoose = require('mongoose');
const config = require('./config.json');

function connectToDatabase(callback)
{
	mongoose.Promise = Promise;
	mongoose.connect(config.database, function(err)
	{
		callback(err);
	});
}

module.exports = connectToDatabase;