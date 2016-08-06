const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.Promise = Promise;
mongoose.connect(config.database);