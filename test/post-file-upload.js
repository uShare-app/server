const httpMocks = require('node-mocks-http');
const should = require('should');

const File = require('../controllers/file.js');
const FileDatabase = require('../models/file.js');

const tools = require('./tools.js');

describe('POST /file/upload', function()
{
	it('should return status 400 (request do not follow the api)', function(done)
	{
		var request = httpMocks.createRequest(
		{
			method: 'POST',
			url: '/file/upload',
		});
		
		var response = tools.buildResponse();

		response.on('end', function()
		{
			response.statusCode.should.equal(400);
			done();
		});

		File.upload(request, response);
	});

	it('should save the file into database', function(done)
	{
		var request = httpMocks.createRequest(
		{
			method: 'POST',
			url: '/file/upload',
			body:
			{
				senderid: 'test framework',
			},
		});

		request.file = 
		{
			filename: 'file',
			originalname: 'file',
			path: '/',
			encoding: '7bit',
			mimetype: 'tar',
			extension: 'file',
			size: 99,
		};

		let response = tools.buildResponse();

		response.on('end', function()
		{
			response.statusCode.should.equal(200);
			FileDatabase.findOne({fileName: 'file', originalFileName: 'file'}, function(err, doc)
			{
				should.not.exist(err);
				should(doc).be.a.Object();
				doc.fileName.should.equal('file');
				doc.originalFileName.should.equal('file');
				doc.path.should.equal('/');
				doc.encoding.should.equal('7bit');
				doc.mimetype.should.equal('tar');
				doc.extension.should.equal('file');
				doc.size.should.equal(99);
				done();
			});
		});

		File.upload(request, response);
	});
})
