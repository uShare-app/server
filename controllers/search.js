const Files = require('../models/file');
const config = require('../config.json');

/**
 * @api {get} /files/search/:page Get server's files (HR)
 * @apiName GetSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's files. Limited to 200 files.
 * Output is human readable.
 * @apiVersion 0.1.0
 * @apiParam {Number} page Search Page (optional)
 */
/**
 * @api {get} /api/files/search/:page Get server's file (JSON)
 * @apiName GetApiSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's files. Limited to 200 files. Output is JSON.
 * @apiVersion 0.1.0
 * @apiParam {Number} page Search Page (optional)
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
	let page;

	page = req.params.page;

	if(page == 'undefined' || page == '1')
	{
		list = Files.find({ available: true }).limit(200);
	}
	else
	{
		let skip;
		skip = 200 * ( page - 1 );
		list = Files.find({ available: true }).skip(skip).limit(200)
	}

	
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
		response += '<table border="solid">';
		response += '<tr>' + 
						'<td>shortName</td>' +
						'<td>originalFileName</td>' +
						'<td>encoding</td>' +
						'<td>mimetype</td>' +
						'<td>extension</td>' +
						'<td>senderid</td>' +
						'<td>views</td>' +
					'</tr>';

		for (var i = files.length - 1; i >= 0; i--) 
		{
			response += '<tr>' +
							'<td><a target="_blank" href="' + config.url + '/' + files[i]['shortName'] + '">' +  files[i]['shortName'] + '</a></td>' +
							'<td>' +  files[i]['originalFileName'] + '</td>' +
							'<td>' +  files[i]['encoding'] + '</td>' +
							'<td>' +  files[i]['mimetype'] + '</td>' +
							'<td>' +  files[i]['extension'] + '</td>' +
							'<td>' +  files[i]['senderid'] + '</td>' +
							'<td>' +  files[i]['views'] + '</td>' +
						'</tr>';
		}

		response += '</table>';
		response += '</body></html>';
		res.status(200).send(response);
	});
}

module.exports = { show };
