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
})
const multer = multer_({ dest: 'data/', storage });

const file = require('./controllers/file');

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

function routes()
{
	app.post('/file/upload', multer.single('file'), file.upload);
}

app.listen(8000, function ()
{
  console.log('Working on port 8000');
});

module.exports = routes;