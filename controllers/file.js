const chance = require('chance');
const config = require('../config.json');
const File = require('../models/file');
const Stats = require('../models/stats');

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

/* This action handle saving new files sended through the API.
 * API Summary:
 * 	Route: /file/upload
 *	HTTP Request:
 *		- multipart/form-data only
 *		- file: the files
 *		- senderid: unique identifier of you app
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

		fileData.save(function (err, fileData)
		{
			if (err)
			{
				res.sendError(err);
				return;
			}

			res.status(200).send(config.url + '/' + shortName);

			Stats.findOne(function(err, document)
			{
				if (err) return;

				if (!document) return;

				++document.files.available;
				++document.files.total;
				document.save(function(){});
			});

		});
	});
}

module.exports = { upload };