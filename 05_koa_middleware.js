var koa = require('koa');
var app = koa();

// x-response-time

app.use(function *(next){
  var start = new Date;
  console.log('1. downstream x-response');
  yield next;
  console.log('5. upstream x-response');
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
  console.log('----- done -----');
});

// logger
app.use(function *(next){
  var start = new Date;
  console.log('2. downstream logger');
  yield next;
  console.log('3. upstream x-response');
  var ms = new Date - start;
  console.log('4. %s %s - %s', this.method, this.url, ms);
});

// response

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
