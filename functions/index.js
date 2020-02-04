const functions = require('firebase-functions');
// const app = require('./app');
// exports.app = functions.https.onRequest(app);

const next = require("next")

var dev = process.env.NODE_ENV !== "production";
var app = next({ dev: false, conf: { distDir: "./app/dist" } });
var handle = app.getRequestHandler();

exports.next = functions.https.onRequest((req, res) => {
  console.log("File: " + req.originalUrl) // log the page.js file that is being requested
  return app.prepare().then(() => handle(req, res))
})