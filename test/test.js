const httpMocks = require('node-mocks-http');
const should = require('should');

const File = require('../controllers/file.js');


describe('GET /', function()
{
	it('should return 404', function(done)
	{
		var request = httpMocks.createRequest(
		{
			method: 'GET',
			url: '/'
		});

		var response = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});

		response.on('end', function()
		{
			response.statusCode.should.equal(404);
			response._getData().should.equal('Document not found.');
			done();
		});

		require('../database.js')(function(){ File.view(request, response); });
	});
});
