const httpMocks = require('node-mocks-http');
const should = require('should');

const File = require('../controllers/file.js');
const FileDatabase = require('../models/file.js');

const tools = require('./tools.js');

describe('GET /:shortName', function()
{
	it('Should return 404', function(done)
	{
		const request = httpMocks.createRequest(
		{
			method: 'GET',
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

		File.view(request, response);
	});

	it('Should return the file', function(done)
	{
		let doc = new FileDatabase;
		
		doc.shortName = 'aab';
		doc.originalFileName = 'aFile';
		doc.mimetype = 'tar';
		doc.path = './test/test.js';
		doc.senderid = 'tests';

		doc.save(function()
		{
			const request = httpMocks.createRequest(
			{
				method: 'GET',
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
				response._headers['Content-Type'].should.equal('tar');
				response._headers['Content-Disposition'].should
					.equal('inline; filename="' + doc.originalFileName + '"');
				done();
			});

			File.view(request, response);
		});
	});
});
