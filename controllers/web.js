function uploadFile(req, res)
{
	res.status(200).render('upload.mustache');
}

module.exports = { uploadFile };
