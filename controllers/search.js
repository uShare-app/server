const Files = require('../models/file');

/**
 * @api {get} /search Get server's files (HR)
 * @apiName GetSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's files. Limited to 200 files.
 * Output is human readable.
 * @apiVersion 0.1.0
 */
/**
 * @api {get} /api/search Get server's file (JSON)
 * @apiName GetApiSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's files. Limited to 200 files. Output is JSON.
 * @apiVersion 0.1.0
 * @apiSuccessExample {json} Success-Response:
 *	[
 *		{
 *			"shortName": String,
 *			"originalFileName": String,
 *			"views": Number,
 *			"extension": String,
 *			"mimetype": String,
 *			"encoding": String,
 *			"size": Number,
 *			"senderid": String,
 *			"receivedAt": Date
 *		},
 *		...
 *	]
 */
function show(req, res)
{
	let list;
	
	list = Files.find({ available: true }).limit(200);
	list.select('-_id shortName originalFileName encoding mimetype extension '
		+ 'size senderid views receivedAt');

	list.exec(function(err, files)
	{
		if (err)
		{
			res.status(500).sendError();
			return;
		}

		if(req.isApi)
		{
			res.status(200).json(files);
			return;
		}

		let response;

		response = '<html><body>';

		for (var i = files.length - 1; i >= 0; i--) 
		{
			response += files[i]['shortName'] + '<br>';
		}

		response += '</body></html>';
		res.status(200).send(response);
	});
}

module.exports = { show };
