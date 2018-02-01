const koa = require('koa');
const app = new koa();
const router = require('./routers.js');

app.use(router.routes());

app.listen(3000);
console.log("server on")