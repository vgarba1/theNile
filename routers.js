const Router = require('koa-router');
const router = new Router();
const db = require('./database.js')

router.get('/', async (cxt, next) => {
  var start = new Date().getTime();
  console.log(start)
  for(var i = 0; i < 10; i ++){
    db.loadData(100000)
    //console.log(limt.prototype)
  }
  //db.testUpdate(10000)
  var elapsed = new Date().getTime() - start;
  console.log(elapsed)
  cxt.body = elapsed
})


module.exports = router