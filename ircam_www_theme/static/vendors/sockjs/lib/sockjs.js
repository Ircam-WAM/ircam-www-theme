(function() {
  var App, Listener, Server, chunking_test, events, fs, generate_dispatcher, iframe, sockjsVersion, trans_eventsource, trans_htmlfile, trans_jsonp, trans_websocket, trans_xhr, utils, webjs,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  events = require('events');

  fs = require('fs');

  webjs = require('./webjs');

  utils = require('./utils');

  trans_websocket = require('./trans-websocket');

  trans_jsonp = require('./trans-jsonp');

  trans_xhr = require('./trans-xhr');

  iframe = require('./iframe');

  trans_eventsource = require('./trans-eventsource');

  trans_htmlfile = require('./trans-htmlfile');

  chunking_test = require('./chunking-test');

  sockjsVersion = function() {
    var pkg;
    try {
      pkg = fs.readFileSync(__dirname + '/../package.json', 'utf-8');
    } catch (x) {

    }
    if (pkg) {
      return JSON.parse(pkg).version;
    } else {
      return null;
    }
  };

  App = (function(_super) {

    __extends(App, _super);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.welcome_screen = function(req, res) {
      res.setHeader('content-type', 'text/plain; charset=UTF-8');
      res.writeHead(200);
      res.end("Welcome to SockJS!\n");
      return true;
    };

    App.prototype.handle_404 = function(req, res) {
      res.setHeader('content-type', 'text/plain; charset=UTF-8');
      res.writeHead(404);
      res.end('404 Error: Page not found\n');
      return true;
    };

    App.prototype.disabled_transport = function(req, res, data) {
      return this.handle_404(req, res, data);
    };

    App.prototype.h_sid = function(req, res, data) {
      var jsid;
      req.cookies = utils.parseCookie(req.headers.cookie);
      if (typeof this.options.jsessionid === 'function') {
        this.options.jsessionid(req, res);
      } else if (this.options.jsessionid && res.setHeader) {
        jsid = req.cookies['JSESSIONID'] || 'dummy';
        res.setHeader('Set-Cookie', 'JSESSIONID=' + jsid + '; path=/');
      }
      return data;
    };

    App.prototype.log = function(severity, line) {
      return this.options.log(severity, line);
    };

    return App;

  })(webjs.GenericApp);

  utils.objectExtend(App.prototype, iframe.app);

  utils.objectExtend(App.prototype, chunking_test.app);

  utils.objectExtend(App.prototype, trans_websocket.app);

  utils.objectExtend(App.prototype, trans_jsonp.app);

  utils.objectExtend(App.prototype, trans_xhr.app);

  utils.objectExtend(App.prototype, trans_eventsource.app);

  utils.objectExtend(App.prototype, trans_htmlfile.app);

  generate_dispatcher = function(options) {
    var dispatcher, opts_filters, p, t,
      _this = this;
    p = function(s) {
      return new RegExp('^' + options.prefix + s + '[/]?$');
    };
    t = function(s) {
      return [p('/([^/.]+)/([^/.]+)' + s), 'server', 'session'];
    };
    opts_filters = function(options_filter) {
      if (options_filter == null) options_filter = 'xhr_options';
      return ['h_sid', 'xhr_cors', 'cache_for', options_filter, 'expose'];
    };
    dispatcher = [['GET', p(''), ['welcome_screen']], ['GET', p('/iframe[0-9-.a-z_]*.html'), ['iframe', 'cache_for', 'expose']], ['OPTIONS', p('/info'), opts_filters('info_options')], ['GET', p('/info'), ['xhr_cors', 'h_no_cache', 'info', 'expose']], ['OPTIONS', p('/chunking_test'), opts_filters()], ['POST', p('/chunking_test'), ['xhr_cors', 'expect_xhr', 'chunking_test']], ['GET', p('/websocket'), ['raw_websocket']], ['GET', t('/jsonp'), ['h_sid', 'h_no_cache', 'jsonp']], ['POST', t('/jsonp_send'), ['h_sid', 'h_no_cache', 'expect_form', 'jsonp_send']], ['POST', t('/xhr'), ['h_sid', 'h_no_cache', 'xhr_cors', 'xhr_poll']], ['OPTIONS', t('/xhr'), opts_filters()], ['POST', t('/xhr_send'), ['h_sid', 'h_no_cache', 'xhr_cors', 'expect_xhr', 'xhr_send']], ['OPTIONS', t('/xhr_send'), opts_filters()], ['POST', t('/xhr_streaming'), ['h_sid', 'h_no_cache', 'xhr_cors', 'xhr_streaming']], ['OPTIONS', t('/xhr_streaming'), opts_filters()], ['GET', t('/eventsource'), ['h_sid', 'h_no_cache', 'eventsource']], ['GET', t('/htmlfile'), ['h_sid', 'h_no_cache', 'htmlfile']]];
    if (options.websocket) {
      dispatcher.push(['GET', t('/websocket'), ['sockjs_websocket']]);
    } else {
      dispatcher.push(['GET', t('/websocket'), ['cache_for', 'disabled_transport']]);
    }
    return dispatcher;
  };

  Listener = (function() {

    function Listener(options, emit) {
      this.options = options;
      this.handler = __bind(this.handler, this);
      this.app = new App();
      this.app.options = options;
      this.app.emit = emit;
      this.app.log('debug', 'SockJS v' + sockjsVersion() + ' ' + 'bound to ' + JSON.stringify(options.prefix));
      this.dispatcher = generate_dispatcher(this.options);
      this.webjs_handler = webjs.generateHandler(this.app, this.dispatcher);
      this.path_regexp = new RegExp('^' + this.options.prefix + '([/].+|[/]?)$');
    }

    Listener.prototype.handler = function(req, res, extra) {
      if (!req.url.match(this.path_regexp)) return false;
      this.webjs_handler(req, res, extra);
      return true;
    };

    Listener.prototype.getHandler = function() {
      var _this = this;
      return function(a, b, c) {
        return _this.handler(a, b, c);
      };
    };

    return Listener;

  })();

  Server = (function(_super) {

    __extends(Server, _super);

    function Server(user_options) {
      this.options = {
        prefix: '',
        response_limit: 128 * 1024,
        websocket: true,
        jsessionid: false,
        heartbeat_delay: 25000,
        disconnect_delay: 5000,
        log: function(severity, line) {
          return console.log(line);
        },
        sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'
      };
      if (user_options) utils.objectExtend(this.options, user_options);
    }

    Server.prototype.listener = function(handler_options) {
      var options,
        _this = this;
      options = utils.objectExtend({}, this.options);
      if (handler_options) utils.objectExtend(options, handler_options);
      return new Listener(options, function() {
        return _this.emit.apply(_this, arguments);
      });
    };

    Server.prototype.installHandlers = function(http_server, handler_options) {
      var handler;
      handler = this.listener(handler_options).getHandler();
      utils.overshadowListeners(http_server, 'request', handler);
      utils.overshadowListeners(http_server, 'upgrade', handler);
      return true;
    };

    Server.prototype.middleware = function(handler_options) {
      var handler;
      handler = this.listener(handler_options).getHandler();
      handler.upgrade = handler;
      return handler;
    };

    return Server;

  })(events.EventEmitter);

  exports.createServer = function(options) {
    return new Server(options);
  };

  exports.listen = function(http_server, options) {
    var srv;
    srv = exports.createServer(options);
    if (http_server) srv.installHandlers(http_server);
    return srv;
  };

}).call(this);
