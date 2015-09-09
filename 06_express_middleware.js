var url = require('url')

exports.create = function(logger) {

  return function(req, res, next) {
    var rEnd = res.end;

    // To track response time
    req.startTime = new Date();
    var client = tools.splithost(req.hostname).subdomain.toLowerCase();

    // Setup the key-value object of data to log and include some basic info
    req.rLog = {
        logdate: tools.dateToString(req.startTime)
      , ip: tools.ip(req) || '-'
      , method: req.method
      , command: url.parse(req.originalUrl).pathname || ''
    };

    // Proxy the real end function
    res.end = function(chunk, encoding) {
      // Do the work expected
      res.end = rEnd;
      res.end(chunk, encoding);

      // And do the work we want now (logging!)
      // Save a few more variables that we can only get at the end
      req.rLog.status = res.statusCode || 0;
      req.rLog.responseTime = (new Date() - req.startTime);

      // Send the log off to winston
      logger.log(req.rLog);
    };

    next();
  };
};

