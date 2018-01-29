const serve = require('koa-static');
const mysql = require('mysql');
const koa = require('koa');
const app = new koa();



app.listen(3000);
console.log("server on")