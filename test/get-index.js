const httpMocks = require('node-mocks-http');
const should = require('should');

const File = require('../controllers/file.js');
const FileDatabase = require('../models/file.js');

const tools = require('./tools.js');

describe('GET /', function()
{
	it('should return 404', function(done)
	{
		var request = httpMocks.createRequest(
		{
			method: 'GET',
			url: '/',
		});

		var response = tools.buildResponse();

		response.on('end', function()
		{
			response.statusCode.should.equal(404);
			response._getData().should.equal('Document not found.');
			done();
		});

		File.view(request, response);
	});
});
