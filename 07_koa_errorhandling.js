var koa = require('koa');
var app = module.exports = koa();

// look ma, error propagation!

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    // some errors will have .status
    // however this is not a guarantee
    this.status = err.status || 500;
    this.type = 'html';
    this.body = '<p>Something <em>exploded</em>, please contact Maru.</p>';
    console.log('I am within the catch block - Error %s', err.message);

    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    this.app.emit('error', err, this);
  }
});

// response

app.use(function *(){
  throw new Error('boom boom');
});

// error handler

app.on('error', function(err){
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.log(err);
  }
});

if (!module.parent) app.listen(3000);