const Mongoose = require('mongoose');

/* Stats have only one entry.
 * It save stats data about all time use of the server.
 */
const StatsSchema = new Mongoose.Schema(
{
	files: {
		total: 
		{
			type: Number,
			default: 0,
		},
		available: 
		{
			type: Number,
			default: 0,
		},
		unavailable: 
		{
			type: Number,
			default: 0,
		},
	},
	views: {
		total: 
		{
			type: Number,
			default: 0,
		},
	},
	actions: {
		deleteFile:
		{
			type: Number,
			default: 0,
		},
	}
});

module.exports = Mongoose.model('Stats', StatsSchema);
