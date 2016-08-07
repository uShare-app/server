const Mongoose = require('mongoose');

const FileSchema = new Mongoose.Schema(
{
	shortName: String,
	fileName: String,
	originalFileName: String,
	path: String,
	encoding: String,
	mimetype: String,
	extension: String,
	size: Number, // In bytes
	senderid: String,
	senderip: String,
	views:
	{
		type: Number,
		default: 0,
	},
	receivedAt:
	{
		type: Date,
		default: Date.now,
	},
	lastViewAt: 
	{
		type: Date,
		default: Date.now,
	},
	available: 
	{
		type: Boolean,
		default: true,
	},
});

FileSchema.methods.incrementViewNumber = function incrementViewNumber()
{
	++this.views.notSilent;
	this.lastViewAt = Date.now();
};

module.exports = Mongoose.model('File', FileSchema);
