const koa = require('koa');
const app = new koa();
const db = require('./Database/database.js');
const AWS = require('./AWS/updatePoll.js');

AWS.poll()
setTimeout(AWS.checkProducts, 60000);

app.listen(8080);
console.log("server on")