/* This test should be called at first in order to let others test work with
 * database.
 */

const httpMocks = require('node-mocks-http');
const should = require('should');

const File = require('../controllers/file.js');
const FileDatabase = require('../models/file.js');

describe('Database', function()
{
	it('should connect to MongoDB', function(done)
	{
		require('../database.js')(function(){}, true);
		done();
	});
});
