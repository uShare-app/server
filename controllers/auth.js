const basicAuth = require('basic-auth');

const config = require('../config.json');
const routes = require('../routes.json');

function authentificator(req, res, next)
{
	Object.keys(routes).forEach(function(key)
	{
		if (routes[key].route === req.route.path
			&& routes[key].method == req.method)
		{
			if (config.auth.routes[key])
			{
				let user;

				user = basicAuth(req);
				if (!user || user.name !== config.auth.username
					|| user.pass !== config.auth.password)
				{
					res.set('WWW-Authenticate', 'Basic realm="uplmg"');
					res.status(403).send('');
				}
				else
					next();
			}
			else
				next();
		}
	});
}

module.exports = authentificator;
