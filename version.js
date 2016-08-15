require('colors');
const request = require('sync-request');

function check(version)
{
	const res = request('GET', 'https://update.uplmg.com/server.json');
	const newVersion = JSON.parse(res.getBody('utf8'));
	if (newVersion.version === version)
		return;
	console.log('A new version'.red, newVersion.version.red, 'is available.'.red);
	console.log('Description:'.red, newVersion.description.red);
	console.log('For more information, go to'.red, newVersion['release-url'].red);
	console.log('To download the latest version, go to'.red, newVersion['download-url'].red);
}


module.exports = check;
