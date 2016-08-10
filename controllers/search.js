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
	let date, datePlusUn;

	if(isDate(req.params.date))
	{
		date = req.params.date;
		page = req.params.page;
	}
	else
	{
		date = null;
		page = req.params.date;
	}

	list = Files.find({ available: true }).limit(200);

	if(date != null)
	{
		date = new Date(date);

		datePlusUn = new Date(date);
		datePlusUn.setHours(26);

		// console.log(date);
		// console.log(datePlusUn);
		// console.log('---');

		list.find(
		{ 
			receivedAt:
			{
				$gt: date,
				$lt: datePlusUn
			}

		});
	}

	if(page != 'undefined' || page != '1')
	{
		let skip;
		skip = 200 * ( page - 1 );
		list.skip(skip);
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

/*
	Determine si c'est uen date ou pas	
*/
function isDate(date)
{
	let expression;
	let j, m, a;
	let laDate;

	if(date == "")
	{
		return false;
	}

	expression = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}");

	if(!expression.test(date))
	{
		return false;
	}

	j = parseInt(date.split("-")[2], 10); // jour
	m = parseInt(date.split("-")[1], 10); // mois
	a = parseInt(date.split("-")[0], 10); // année

	laDate = new Date(a, m, j);

	return (laDate.getFullYear() != a || laDate.getMonth() != m) ? false : true;
}

module.exports = { show };
