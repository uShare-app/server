require('colors');

const version = '0.0.1';

console.log('Welcome to Uplimg\'s server.\nVersion:'.green, version.green);

require('./database');
require('./routes')();