/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['middleware/compress.js']) {
  _$jscoverage['middleware/compress.js'] = [];
  _$jscoverage['middleware/compress.js'][12] = 0;
  _$jscoverage['middleware/compress.js'][18] = 0;
  _$jscoverage['middleware/compress.js'][27] = 0;
  _$jscoverage['middleware/compress.js'][28] = 0;
  _$jscoverage['middleware/compress.js'][61] = 0;
  _$jscoverage['middleware/compress.js'][62] = 0;
  _$jscoverage['middleware/compress.js'][63] = 0;
  _$jscoverage['middleware/compress.js'][66] = 0;
  _$jscoverage['middleware/compress.js'][67] = 0;
  _$jscoverage['middleware/compress.js'][74] = 0;
  _$jscoverage['middleware/compress.js'][78] = 0;
  _$jscoverage['middleware/compress.js'][79] = 0;
  _$jscoverage['middleware/compress.js'][80] = 0;
  _$jscoverage['middleware/compress.js'][85] = 0;
  _$jscoverage['middleware/compress.js'][86] = 0;
  _$jscoverage['middleware/compress.js'][87] = 0;
  _$jscoverage['middleware/compress.js'][92] = 0;
  _$jscoverage['middleware/compress.js'][93] = 0;
  _$jscoverage['middleware/compress.js'][96] = 0;
  _$jscoverage['middleware/compress.js'][99] = 0;
  _$jscoverage['middleware/compress.js'][102] = 0;
  _$jscoverage['middleware/compress.js'][105] = 0;
  _$jscoverage['middleware/compress.js'][108] = 0;
  _$jscoverage['middleware/compress.js'][111] = 0;
  _$jscoverage['middleware/compress.js'][112] = 0;
  _$jscoverage['middleware/compress.js'][113] = 0;
  _$jscoverage['middleware/compress.js'][114] = 0;
  _$jscoverage['middleware/compress.js'][115] = 0;
  _$jscoverage['middleware/compress.js'][121] = 0;
  _$jscoverage['middleware/compress.js'][124] = 0;
  _$jscoverage['middleware/compress.js'][127] = 0;
  _$jscoverage['middleware/compress.js'][128] = 0;
  _$jscoverage['middleware/compress.js'][132] = 0;
  _$jscoverage['middleware/compress.js'][133] = 0;
  _$jscoverage['middleware/compress.js'][136] = 0;
  _$jscoverage['middleware/compress.js'][137] = 0;
  _$jscoverage['middleware/compress.js'][140] = 0;
  _$jscoverage['middleware/compress.js'][141] = 0;
  _$jscoverage['middleware/compress.js'][145] = 0;
}
_$jscoverage['middleware/compress.js'][12]++;
var zlib = require("zlib");
_$jscoverage['middleware/compress.js'][18]++;
exports.methods = {gzip: zlib.createGzip, deflate: zlib.createDeflate};
_$jscoverage['middleware/compress.js'][27]++;
exports.filter = (function (req, res) {
  _$jscoverage['middleware/compress.js'][28]++;
  return /json|text|javascript/.test(res.getHeader("Content-Type"));
});
_$jscoverage['middleware/compress.js'][61]++;
module.exports = (function compress(options) {
  _$jscoverage['middleware/compress.js'][62]++;
  options = options || {};
  _$jscoverage['middleware/compress.js'][63]++;
  var names = Object.keys(exports.methods), filter = options.filter || exports.filter;
  _$jscoverage['middleware/compress.js'][66]++;
  return (function (req, res, next) {
  _$jscoverage['middleware/compress.js'][67]++;
  var accept = req.headers["accept-encoding"], write = res.write, end = res.end, stream, method;
  _$jscoverage['middleware/compress.js'][74]++;
  res.setHeader("Vary", "Accept-Encoding");
  _$jscoverage['middleware/compress.js'][78]++;
  res.write = (function (chunk, encoding) {
  _$jscoverage['middleware/compress.js'][79]++;
  if (! this.headerSent) {
    _$jscoverage['middleware/compress.js'][79]++;
    this._implicitHeader();
  }
  _$jscoverage['middleware/compress.js'][80]++;
  return stream? stream.write(new Buffer(chunk, encoding)): write.call(res, chunk, encoding);
});
  _$jscoverage['middleware/compress.js'][85]++;
  res.end = (function (chunk, encoding) {
  _$jscoverage['middleware/compress.js'][86]++;
  if (chunk) {
    _$jscoverage['middleware/compress.js'][86]++;
    this.write(chunk, encoding);
  }
  _$jscoverage['middleware/compress.js'][87]++;
  return stream? stream.end(): end.call(res);
});
  _$jscoverage['middleware/compress.js'][92]++;
  res.on("header", (function () {
  _$jscoverage['middleware/compress.js'][93]++;
  var encoding = res.getHeader("Content-Encoding") || "identity";
  _$jscoverage['middleware/compress.js'][96]++;
  if ("identity" != encoding) {
    _$jscoverage['middleware/compress.js'][96]++;
    return;
  }
  _$jscoverage['middleware/compress.js'][99]++;
  if (! filter(req, res)) {
    _$jscoverage['middleware/compress.js'][99]++;
    return;
  }
  _$jscoverage['middleware/compress.js'][102]++;
  if (! accept) {
    _$jscoverage['middleware/compress.js'][102]++;
    return;
  }
  _$jscoverage['middleware/compress.js'][105]++;
  if ("HEAD" == req.method) {
    _$jscoverage['middleware/compress.js'][105]++;
    return;
  }
  _$jscoverage['middleware/compress.js'][108]++;
  if ("*" == accept.trim()) {
    _$jscoverage['middleware/compress.js'][108]++;
    method = "gzip";
  }
  _$jscoverage['middleware/compress.js'][111]++;
  if (! method) {
    _$jscoverage['middleware/compress.js'][112]++;
    for (var i = 0, len = names.length; i < len; ++i) {
      _$jscoverage['middleware/compress.js'][113]++;
      if (~ accept.indexOf(names[i])) {
        _$jscoverage['middleware/compress.js'][114]++;
        method = names[i];
        _$jscoverage['middleware/compress.js'][115]++;
        break;
      }
}
  }
  _$jscoverage['middleware/compress.js'][121]++;
  if (! method) {
    _$jscoverage['middleware/compress.js'][121]++;
    return;
  }
  _$jscoverage['middleware/compress.js'][124]++;
  stream = exports.methods[method](options);
  _$jscoverage['middleware/compress.js'][127]++;
  res.setHeader("Content-Encoding", method);
  _$jscoverage['middleware/compress.js'][128]++;
  res.removeHeader("Content-Length");
  _$jscoverage['middleware/compress.js'][132]++;
  stream.on("data", (function (chunk) {
  _$jscoverage['middleware/compress.js'][133]++;
  write.call(res, chunk);
}));
  _$jscoverage['middleware/compress.js'][136]++;
  stream.on("end", (function () {
  _$jscoverage['middleware/compress.js'][137]++;
  end.call(res);
}));
  _$jscoverage['middleware/compress.js'][140]++;
  stream.on("drain", (function () {
  _$jscoverage['middleware/compress.js'][141]++;
  res.emit("drain");
}));
}));
  _$jscoverage['middleware/compress.js'][145]++;
  next();
});
});
_$jscoverage['middleware/compress.js'].source = ["/*!"," * Connect - compress"," * Copyright(c) 2010 Sencha Inc."," * Copyright(c) 2011 TJ Holowaychuk"," * MIT Licensed"," */","","/**"," * Module dependencies."," */","","var zlib = require('zlib');","","/**"," * Supported content-encoding methods."," */","","exports.methods = {","    gzip: zlib.createGzip","  , deflate: zlib.createDeflate","};","","/**"," * Default filter function."," */","","exports.filter = function(req, res){","  return /json|text|javascript/.test(res.getHeader('Content-Type'));","};","","/**"," * Compress:"," *"," * Compress response data with gzip/deflate."," *"," * Filter:"," *"," *  A `filter` callback function may be passed to"," *  replace the default logic of:"," *"," *     exports.filter = function(req, res){"," *       return /json|text|javascript/.test(res.getHeader('Content-Type'));"," *     };"," *"," * Options:"," *"," *  All remaining options are passed to the gzip/deflate"," *  creation functions. Consult node's docs for additional details."," *"," *   - `chunkSize` (default: 16*1024)"," *   - `windowBits`"," *   - `level`: 0-9 where 0 is no compression, and 9 is slow but best compression"," *   - `memLevel`: 1-9 low is slower but uses less memory, high is fast but uses more"," *   - `strategy`: compression strategy"," *"," * @param {Object} options"," * @return {Function}"," * @api public"," */","","module.exports = function compress(options) {","  options = options || {};","  var names = Object.keys(exports.methods)","    , filter = options.filter || exports.filter;","","  return function(req, res, next){","    var accept = req.headers['accept-encoding']","      , write = res.write","      , end = res.end","      , stream","      , method;","","    // vary","    res.setHeader('Vary', 'Accept-Encoding');","","    // proxy","","    res.write = function(chunk, encoding){","      if (!this.headerSent) this._implicitHeader();","      return stream","        ? stream.write(new Buffer(chunk, encoding))","        : write.call(res, chunk, encoding);","    };","","    res.end = function(chunk, encoding){","      if (chunk) this.write(chunk, encoding);","      return stream","        ? stream.end()","        : end.call(res);","    };","","    res.on('header', function(){","      var encoding = res.getHeader('Content-Encoding') || 'identity';","","      // already encoded","      if ('identity' != encoding) return; ","","      // default request filter","      if (!filter(req, res)) return;","","      // SHOULD use identity","      if (!accept) return;","","      // head","      if ('HEAD' == req.method) return;","","      // default to gzip","      if ('*' == accept.trim()) method = 'gzip';","","      // compression method","      if (!method) {","        for (var i = 0, len = names.length; i &lt; len; ++i) {","          if (~accept.indexOf(names[i])) {","            method = names[i];","            break;","          }","        }","      }","","      // compression method","      if (!method) return;","","      // compression stream","      stream = exports.methods[method](options);","","      // header fields","      res.setHeader('Content-Encoding', method);","      res.removeHeader('Content-Length');","","      // compression","","      stream.on('data', function(chunk){","        write.call(res, chunk);","      });","","      stream.on('end', function(){","        end.call(res);","      });","","      stream.on('drain', function() {","        res.emit('drain');","      });","    });","","    next();","  };","};"];
