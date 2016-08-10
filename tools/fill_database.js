/* This file is an independant tool. Run it seperately with node.
 * This tool will fille the file database with 1050 entries.
 * Shortname start from 0 and are incremented up to 1049 in order to make
 * development and debugging easier.
 */

require('colors');
const chance = require('chance');

const database = require('../database');

console.log('Welcome. This tool will populate database with 1050 new entries.'.green);

database(function(err)
{
	if (err)
	{
		console.log('Cannot connect to database. Exiting...'.red);
		process.exit(1);
	}

	const File = require('../models/file');

	for (let i = 0; i < 1050; ++i)
	{
		const file = new File;
		file.shortName = i;
		file.fileName = '';
		file.originalFileName = '';
		file.path = '';
		file.encoding = '';
		file.mimetype = '';
		file.extension = '';
		file.size = 0;
		file.senderid = 'Generator tool';
		file.senderip = '';
		file.save(function(err)
		{
			if (err)
			{
				console.log('Error while saving a file. Exiting...'.red);
				process.exit(1);
			}

			if (i == 1049)
			{
				console.log('Last file saved.'.green);
				// I suppose every saving task are ended now
				process.exit(0);
			}
		});
	}

});