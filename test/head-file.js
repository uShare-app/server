const httpMocks = require('node-mocks-http');
const should = require('should');

const File = require('../controllers/file.js');
const FileDatabase = require('../models/file.js');

const tools = require('./tools.js');

describe('HEAD /:shortname', function()
{
	it('should return 404', function(done)
	{
		const request = httpMocks.createRequest(
		{
			method: 'HEAD',
			url: '/',
			params:
			{
				shortname: 'aaa',
			},
		});

		let response = tools.buildResponse();

		response.on('end', function()
		{
			response.statusCode.should.equal(404);
			done();
		});

		File.info(request, response);
	});

	it('should return infos about the file', function(done)
	{
		const request = httpMocks.createRequest(
		{
			method: 'HEAD',
			url: '/',
			params:
			{
				shortname: 'aab',
			},
		});

		let response = tools.buildResponse();

		response.on('end', function()
		{
			response.statusCode.should.equal(200);
			response._headers.should.be.a.Object();
			response._headers['Uplmg-FileName'].should.equal('aFile');
			response._headers['Uplmg-Type'].should.equal('tar');
			response._headers['Uplmg-Senderid'].should.equal('tests');
			done();
		});

		File.info(request, response);
	});
});
