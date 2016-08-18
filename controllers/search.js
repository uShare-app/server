const entities = require('html-entities').AllHtmlEntities;

const Files = require('../models/file');
const config = require('../config.json');

/**
 * @api {get} /files/search/:date?/:page? Get server's files (HR)
 * @apiName GetSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's files. Limited to 200 files.
 * Output is human readable.
 * @apiVersion 0.1.0
 * @apiParam {Number} page Page to offset the limit of 200 (optional)
 * @apiParam {Date} date Limit the search to a specific day. Data format:
 * YYYY-MM-DD (optional)
 */
/**
 * @api {get} /api/files/search/:date?/:page? Get server's files (JSON)
 * @apiName GetApiSearch
 * @apiGroup Search
 * @apiPermission Need to be enabled in configuration
 * @apiDescription Get server's files. Limited to 200 files. Output is JSON.
 * @apiVersion 0.1.0
 * @apiParam {Number} page Page to offset the limit of 200 (optional)
 * @apiParam {Date} date Limit the search to a specific day. Data format:
 * YYYY-MM-DD (optional)
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
	let date, nextDate;

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
	list.select('-_id shortName originalFileName encoding mimetype extension '
		+ 'size senderid views receivedAt');
	list.sort('-receivedAt');

	if(date !== null)
	{
		date = new Date(date);
		date.setHours(-24);

		nextDate = new Date(date);
		nextDate.setHours(24);

		list.find(
		{ 
			receivedAt:
			{
				$gt: date,
				$lt: nextDate
			}
		});
	}

	if(page)
	{
		let skip;
		skip = 200 * (page - 1);
		list.skip(skip);
	}

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

		response = '<!DOCTYPE html><html><body>';
		response += '<table border="solid">';
		response += '<tr>'
					+ '<td>shortName</td>'
					+ '<td>originalFileName</td>'
					+ '<td>size</td>'
					+ '<td>encoding</td>'
					+ '<td>mimetype</td>'
					+ '<td>extension</td>'
					+ '<td>senderid</td>'
					+ '<td>views</td>'
					+ '</tr>';

		for (let i = 0; i < files.length; ++i) 
		{
			files[i]['shortName'] = files[i]['shortName'] ? files[i]['shortName'] : '';
			files[i]['originalFileName'] = files[i]['originalFileName'] ? files[i]['originalFileName'] : '';
			files[i]['encoding'] = files[i]['encoding'] ? files[i]['encoding'] : '';
			files[i]['mimetype'] = files[i]['mimetype'] ? files[i]['mimetype'] : '';
			files[i]['extension'] = files[i]['extension'] ? files[i]['extension'] : '';
			files[i]['senderid'] = files[i]['senderid'] ? files[i]['senderid'] : '';
			response += '<tr>'
						+ '<td><a target="_blank" href="' + config.url + '/' + entities.encode(files[i]['shortName']) + '">' +  entities.encode(files[i]['shortName']) + '</a></td>'
						+ '<td>' + entities.encode(files[i]['originalFileName']) + '</td>'
						+ '<td>' + humanFileSize(files[i]['size'], true) + '</td>'
						+ '<td>' + entities.encode(files[i]['encoding']) + '</td>'
						+ '<td>' + entities.encode(files[i]['mimetype']) + '</td>'
						+ '<td>' + entities.encode(files[i]['extension']) + '</td>'
						+ '<td>' + entities.encode(files[i]['senderid']) + '</td>'
						+ '<td>' + files[i]['views'] + '</td>'
						+ '</tr>';
		}

		response += '</table>';
		response += '</body></html>';
		res.status(200).send(response);
	});
}

function humanFileSize(bytes, si)
{
	var thresh = si ? 1000 : 1024;
	if(Math.abs(bytes) < thresh)
		return bytes + ' B';
	var units = si
		? ['kB','MB','GB','TB','PB','EB','ZB','YB']
		: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while(Math.abs(bytes) >= thresh && u < units.length - 1);
	return bytes.toFixed(1) + ' ' + units[u];
}

/*
 * Dates format: YYYY-MM-DD
 */
function isDate(date)
{
	let expression;
	let d, m, y;

	if (!date)
	{
		return false;
	}

	expression = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}");

	if (!expression.test(date))
	{
		return false;
	}

	y = parseInt(date.split("-")[0], 10);
	m = parseInt(date.split("-")[1], 10);
	d = parseInt(date.split("-")[2], 10);

	date = new Date(y, m, d);

	return (date.getFullYear() === y
		&& date.getMonth() === m);
}

module.exports = { show };
