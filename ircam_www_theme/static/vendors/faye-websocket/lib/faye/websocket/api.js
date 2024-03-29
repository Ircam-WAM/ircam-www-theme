var EventTarget = require('./api/event_target'),
    Event       = require('./api/event');

var API = {
  CONNECTING:   0,
  OPEN:         1,
  CLOSING:      2,
  CLOSED:       3,
  
  _open: function() {
    if (this._parser && !this._parser.isOpen()) return;
    this.readyState = API.OPEN;
    
    var buffer = this._sendBuffer || [],
        message;
    
    while (message = buffer.shift())
      this.send.apply(this, message);
    
    var event = new Event('open');
    event.initEvent('open', false, false);
    this.dispatchEvent(event);
  },
  
  receive: function(data) {
    if (this.readyState !== API.OPEN) return false;
    var event = new Event('message');
    event.initEvent('message', false, false);
    event.data = data;
    this.dispatchEvent(event);
  },
  
  send: function(data, type, errorType) {
    if (this.readyState === API.CONNECTING) {
      if (this._sendBuffer) {
        this._sendBuffer.push(arguments);
        return true;
      } else {
        throw new Error('Cannot call send(), socket is not open yet');
      }
    }
    
    if (this.readyState === API.CLOSED)
      return false;
    
    var frame = this._parser.frame(data, type, errorType);
    try {
      this._stream.write(frame, 'binary');
      return true;
    } catch (e) {
      return false;
    }
  },
  
  close: function(code, reason, ack) {
    if (this.readyState === API.CLOSING ||
        this.readyState === API.CLOSED) return;
    
    this.readyState = API.CLOSING;
    
    var close = function() {
      this.readyState = API.CLOSED;
      if (this._pingLoop) clearInterval(this._pingLoop);
      this._stream.end();
      var event = new Event('close', {code: code || 1000, reason: reason || ''});
      event.initEvent('close', false, false);
      this.dispatchEvent(event);
    };
    
    if (ack !== false) {
      if (this._parser.close) this._parser.close(code, reason, close, this);
      else close.call(this);
    } else {
      if (this._parser.close) this._parser.close(code, reason);
      close.call(this);
    }
  }
};

for (var key in EventTarget) API[key] = EventTarget[key];

module.exports = API;

