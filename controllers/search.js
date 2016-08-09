const Files = require('../models/file.js');

/**
 * @api {get} /search Get server's file (HR)
 * @apiName GetSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's file. Output is human readable.
 * @apiVersion 0.1.0
 */
/**
 * @api {get} /api/search Get server's file (JSON)
 * @apiName GetApiSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's file. Output is JSON.
 * @apiVersion 0.1.0
 */
function show(req, res)
{
	let list;
	
	list = Files.find({}).limit(200);

	list.exec(function(err, fileFind)
	{

		if (err)
		{
			res.status(500).sendError();
			return;
		}
		
		if(req.isApi)
		{
			res.status(200).json(fileFind);
			return;
		}

		let response;

		response = '<html><body>';

		for (var i = fileFind.length - 1; i >= 0; i--) 
		{
			response += fileFind[i]['shortName'] + '<br>';
		}

		response += '</body></html>';
		res.status(200).send(response);

	});
}

module.exports = { show };