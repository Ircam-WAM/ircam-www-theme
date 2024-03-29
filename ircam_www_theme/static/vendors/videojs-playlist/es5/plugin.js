'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _playlistMaker = require('./playlist-maker');

var _playlistMaker2 = _interopRequireDefault(_playlistMaker);

/**
 * The video.js playlist plugin. Invokes the playlist-maker to create a
 * playlist function on the specific player.
 *
 * @param {Array} list
 */
var plugin = function plugin(list, item) {
  (0, _playlistMaker2['default'])(this, list, item);
};

_videoJs2['default'].plugin('playlist', plugin);

exports['default'] = plugin;
module.exports = exports['default'];