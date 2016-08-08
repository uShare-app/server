const path = require('path');

const chance = require('chance');

const config = require('../config.json');
const File = require('../models/file');

/* getRandomShortName return through the callback a short name
 * according to the configuration file.
 * Short names are used to access files through an URL.
 */
function getRandomShortName(callback)
{
	const shortName = chance(Date.now()).string(config.shortName);

	File.findOne({ shortName }, function(err, document)
	{
		if (err)
		{
			callback(err, null);
			return;
		}

		if (document)
		{
			/* If this shortName already exist, just rerun the function. */
			getRandomShortName(callback);
			return;
		}

		callback(null, shortName);
	});
}

/**
 * @api {post} /file/upload Save a new file
 * @apiName PostFile
 * @apiGroup File
 * @apiPermission none
 * @apiDescription The HTTP request must be multipart/form-data only.
 * @apiVersion 0.1.0
 * @apiSuccessExample {text} Success-Response:
 *		HTTP/1.1 200 OK
 *		http://uplmg.com/AYZ
 *
 * @apiHeader {File} file The file you want to save
 * @apiHeader {String} senderid Name of your application
 */
function upload(req, res)
{
	if (!req.file || !req.body.senderid)
	{
		res.status(400);
		res.sendError('You must follow the API. See docs for more informations.');
		return;
	}

	getRandomShortName(function(err, shortName)
	{
		if (err)
		{
			res.status(500).sendError();
		}

		if (!shortName)
		{
			res.status(500).sendError();
			return;
		}

		const fileData = new File(); // The file inside MongoDB
		const file = req.file; // The file by itself

		fileData.shortName = shortName;
		fileData.fileName = file.filename;
		fileData.originalFileName = file.originalname;
		fileData.path = file.path;
		fileData.encoding = file.encoding;
		fileData.mimetype = file.mimetype;
		fileData.extension = file.extension; // ?
		fileData.size = file.size;
		fileData.senderid = req.body.senderid;
		fileData.senderip = req.ip;

		fileData.save(function (err, fileData)
		{
			if (err)
			{
				res.sendError(err);
				return;
			}

			res.status(200).send(config.url + '/' + shortName);
		});
	});
}

/**
 * @api {get} /:id Get a file
 * @apiName GetFile
 * @apiGroup File
 * @apiPermission none
 * @apiDescription Get a file previously uploaded using PostFile
 * @apiVersion 0.1.0
 * @apiParam {String} id The unique identifier of the file.
 */
function view(req, res)
{
	File.findOne({ shortName: req.params.shortname }, function(err, document)
	{
		if (err)
		{
			res.status(500).send('An error occurred.');
			return;
		}

		if (!document)
		{
			res.status(404).send('Document not found.');
			return;
		}

		const options = {};
		options.lastModified = false;
		options.headers =
		{
			'Content-Disposition': `inline; filename="${document.originalFileName}"`,
			'Content-Type': document.mimetype,
		};
		res.status(200).sendFile(path.resolve(document.path), options);
	});
}

module.exports = { upload, view };
