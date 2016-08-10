const config = require('./config.json');

const express = require('express');
const app = express();

const multer_ = require('multer');
const storage = multer_.diskStorage(
{
	filename: function(req, file, cb)
	{
		cb(null, file.originalname + Date.now());
	},
	destination: function(req, file, cb)
	{
		cb(null, 'data/');
	}
});

const multer = multer_({ dest: 'data/', storage });

const file = require('./controllers/file');
const stats = require('./controllers/stats');
const search = require('./controllers/search');
const auth = require('./controllers/auth');

app.use(function (req, res, next)
{
	res.sendError = function sendError(message)
	{
		if(!message)
			message = 'An error occurred';
		res.json({ error: true, message: message });
	};

	next();
});

const middlewareAPI = function(req, res, next)
{
	req.isApi = true;
	next();
}

function routes(callback)
{
	if (config.features.search)
	{
		app.get('/files/search/:date?/:page?', auth, search.show);
		app.get('/api/search/:date?/:page?', auth, middlewareAPI, search.show);
	}
	
	if (config.features.stats)
	{
		app.get('/files/stats', auth, stats.show);
		app.get('/api/files/stats', auth, middlewareAPI, stats.show);
	}

	app.post('/file/upload', auth, multer.single('file'), file.upload);
	app.head('/:shortname', auth, file.info);
	app.get('/:shortname', auth, file.view);

	app.use(function(req, res)
	{
		res.status(404).send('Document not found.');
	});

	app.listen(config.port, callback);
}

module.exports = routes;
