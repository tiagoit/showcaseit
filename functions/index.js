const functions = require('firebase-functions');
const api = require('./api');

exports.api = functions.https.onRequest(api);
