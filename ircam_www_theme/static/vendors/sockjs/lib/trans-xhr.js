(function() {
  var XhrPollingReceiver, XhrStreamingReceiver, transport, utils,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  transport = require('./transport');

  utils = require('./utils');

  XhrStreamingReceiver = (function(_super) {

    __extends(XhrStreamingReceiver, _super);

    function XhrStreamingReceiver() {
      XhrStreamingReceiver.__super__.constructor.apply(this, arguments);
    }

    XhrStreamingReceiver.prototype.protocol = "xhr-streaming";

    XhrStreamingReceiver.prototype.doSendFrame = function(payload) {
      return XhrStreamingReceiver.__super__.doSendFrame.call(this, payload + '\n');
    };

    return XhrStreamingReceiver;

  })(transport.ResponseReceiver);

  XhrPollingReceiver = (function(_super) {

    __extends(XhrPollingReceiver, _super);

    function XhrPollingReceiver() {
      XhrPollingReceiver.__super__.constructor.apply(this, arguments);
    }

    XhrPollingReceiver.prototype.protocol = "xhr-polling";

    XhrPollingReceiver.prototype.max_response_size = 1;

    return XhrPollingReceiver;

  })(XhrStreamingReceiver);

  exports.app = {
    xhr_options: function(req, res) {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
      res.setHeader('Access-Control-Max-Age', res.cache_for);
      return '';
    },
    xhr_send: function(req, res, data) {
      var d, jsonp, message, _i, _len;
      if (!data) {
        throw {
          status: 500,
          message: 'Payload expected.'
        };
      }
      try {
        d = JSON.parse(data);
      } catch (x) {
        throw {
          status: 500,
          message: 'Broken JSON encoding.'
        };
      }
      if (!d || d.__proto__.constructor !== Array) {
        throw {
          status: 500,
          message: 'Payload expected.'
        };
      }
      jsonp = transport.Session.bySessionId(req.session);
      if (!jsonp) {
        throw {
          status: 404
        };
      }
      for (_i = 0, _len = d.length; _i < _len; _i++) {
        message = d[_i];
        jsonp.didMessage(message);
      }
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      res.writeHead(204);
      res.end();
      return true;
    },
    xhr_cors: function(req, res, content) {
      var headers, origin;
      if (!req.headers['origin'] || req.headers['origin'] === 'null') {
        origin = '*';
      } else {
        origin = req.headers['origin'];
      }
      res.setHeader('Access-Control-Allow-Origin', origin);
      headers = req.headers['access-control-request-headers'];
      if (headers) res.setHeader('Access-Control-Allow-Headers', headers);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return content;
    },
    xhr_poll: function(req, res, _, next_filter) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      res.writeHead(200);
      transport.register(req, this, new XhrPollingReceiver(req, res, this.options));
      return true;
    },
    xhr_streaming: function(req, res, _, next_filter) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      res.writeHead(200);
      res.write(Array(2049).join('h') + '\n');
      transport.register(req, this, new XhrStreamingReceiver(req, res, this.options));
      return true;
    }
  };

}).call(this);
