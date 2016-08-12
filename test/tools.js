const httpMocks = require('node-mocks-http');

function buildResponse()
{
	let res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
	
	res.sendError = function sendError(message)
	{
		if(!message)
			message = 'An error occurred';
		res.json({ error: true, message: message });
	};

	res.sendFile = function sendFile(file, options)
	{
		res.set(options.headers);
		res.send('');
	};

	return res;
}

module.exports = { buildResponse };
