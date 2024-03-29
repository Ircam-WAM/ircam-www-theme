'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _playItem = require('./play-item');

var _playItem2 = _interopRequireDefault(_playItem);

var _autoAdvance = require('./auto-advance');

var _autoadvance = _interopRequireWildcard(_autoAdvance);

/**
 * Given two sources, check to see whether the two sources are equal.
 * If both source urls have a protocol, the protocols must match, otherwise, protocols
 * are ignored.
 *
 * @private
 * @param {String|Object} source1
 * @param {String|Object} source2
 * @return {Boolean}
 */
var sourceEquals = function sourceEquals(source1, source2) {
  var src1 = source1;
  var src2 = source2;

  if (typeof source1 === 'object') {
    src1 = source1.src;
  }
  if (typeof source2 === 'object') {
    src2 = source2.src;
  }

  if (/^\/\//.test(src1)) {
    src2 = src2.slice(src2.indexOf('//'));
  }
  if (/^\/\//.test(src2)) {
    src1 = src1.slice(src1.indexOf('//'));
  }

  return src1 === src2;
};

/**
 * Look through an array of playlist items for a specific `source`;
 * checking both the value of elements and the value of their `src`
 * property.
 *
 * @private
 * @param   {Array} arr
 * @param   {String} src
 * @return  {Number}
 */
var indexInSources = function indexInSources(arr, src) {
  for (var i = 0; i < arr.length; i++) {
    var sources = arr[i].sources;

    if (Array.isArray(sources)) {
      for (var j = 0; j < sources.length; j++) {
        var source = sources[j];

        if (source && sourceEquals(source, src)) {
          return i;
        }
      }
    }
  }

  return -1;
};

/**
 * Factory function for creating new playlist implementation on the given player.
 *
 * API summary:
 *
 * playlist(['a', 'b', 'c']) // setter
 * playlist() // getter
 * playlist.currentItem() // getter, 0
 * playlist.currentItem(1) // setter, 1
 * playlist.next() // 'c'
 * playlist.previous() // 'b'
 * playlist.first() // 'a'
 * playlist.last() // 'c'
 * playlist.autoadvance(5) // 5 second delay
 * playlist.autoadvance() // cancel autoadvance
 *
 * @param  {Player} player
 * @param  {Array}  [initialList]
 *         If given, an initial list of sources with which to populate
 *         the playlist.
 * @param  {Number}  [initialIndex]
 *         If given, the index of the item in the list that should
 *         be loaded first. If -1, no video is loaded. If omitted, The
 *         the first video is loaded.
 *
 * @return {Function}
 *         Returns the playlist function specific to the given player.
 */
var factory = function factory(player, initialList) {
  var initialIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var list = Array.isArray(initialList) ? initialList.slice() : [];

  /**
   * Get/set the playlist for a player.
   *
   * This function is added as an own property of the player and has its
   * own methods which can be called to manipulate the internal state.
   *
   * @param  {Array} [newList]
   *         If given, a new list of sources with which to populate the
   *         playlist. Without this, the function acts as a getter.
   * @param  {Number}  [newIndex]
   *         If given, the index of the item in the list that should
   *         be loaded first. If -1, no video is loaded. If omitted, The
   *         the first video is loaded.
   *
   * @return {Array}
   */
  var playlist = player.playlist = function (newList) {
    var newIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    if (Array.isArray(newList)) {
      list = newList.slice();
      if (newIndex !== -1) {
        playlist.currentItem(newIndex);
      }
      playlist.changeTimeout_ = _globalWindow2['default'].setTimeout(function () {
        player.trigger('playlistchange');
      }, 0);
    }

    // Always return a shallow clone of the playlist list.
    return list.slice();
  };

  player.on('loadstart', function () {
    if (playlist.currentItem() === -1) {
      _autoadvance.reset(player);
    }
  });

  player.on('dispose', function () {
    _globalWindow2['default'].clearTimeout(playlist.changeTimeout_);
  });

  (0, _objectAssign2['default'])(playlist, {
    currentIndex_: -1,
    player_: player,
    autoadvance_: {},

    /**
     * Get or set the current item in the playlist.
     *
     * @param  {Number} [index]
     *         If given as a valid value, plays the playlist item at that index.
     *
     * @return {Number}
     *         The current item index.
     */
    currentItem: function currentItem(index) {
      if (typeof index === 'number' && playlist.currentIndex_ !== index && index >= 0 && index < list.length) {
        playlist.currentIndex_ = index;
        (0, _playItem2['default'])(playlist.player_, playlist.autoadvance_.delay, list[playlist.currentIndex_]);
      } else {
        playlist.currentIndex_ = playlist.indexOf(playlist.player_.currentSrc() || '');
      }

      return playlist.currentIndex_;
    },

    /**
     * Checks if the playlist contains a value.
     *
     * @param  {String|Object|Array} value
     * @return {Boolean}
     */
    contains: function contains(value) {
      return playlist.indexOf(value) !== -1;
    },

    /**
     * Gets the index of a value in the playlist or -1 if not found.
     *
     * @param  {String|Object|Array} value
     * @return {Number}
     */
    indexOf: function indexOf(value) {
      if (typeof value === 'string') {
        return indexInSources(list, value);
      }

      var sources = Array.isArray(value) ? value : value.sources;

      for (var i = 0; i < sources.length; i++) {
        var source = sources[i];

        if (typeof source === 'string') {
          return indexInSources(list, source);
        } else if (source.src) {
          return indexInSources(list, source.src);
        }
      }

      return -1;
    },

    /**
     * Plays the first item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if the list is empty.
     */
    first: function first() {
      if (list.length) {
        return list[playlist.currentItem(0)];
      }

      playlist.currentIndex_ = -1;
    },

    /**
     * Plays the last item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if the list is empty.
     */
    last: function last() {
      if (list.length) {
        return list[playlist.currentItem(list.length - 1)];
      }

      playlist.currentIndex_ = -1;
    },

    /**
     * Plays the next item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if on last item.
     */
    next: function next() {

      // Make sure we don't go past the end of the playlist.
      var index = Math.min(playlist.currentIndex_ + 1, list.length - 1);

      if (index !== playlist.currentIndex_) {
        return list[playlist.currentItem(index)];
      }
    },

    /**
     * Plays the previous item in the playlist.
     *
     * @return {Object|undefined}
     *         Returns undefined and has no side effects if on first item.
     */
    previous: function previous() {

      // Make sure we don't go past the start of the playlist.
      var index = Math.max(playlist.currentIndex_ - 1, 0);

      if (index !== playlist.currentIndex_) {
        return list[playlist.currentItem(index)];
      }
    },

    /**
     * Sets up auto-advance on the playlist.
     *
     * @param {Number} delay
     *        The number of seconds to wait before each auto-advance.
     */
    autoadvance: function autoadvance(delay) {
      playlist.autoadvance_.delay = delay;
      _autoadvance.setup(playlist.player_, delay);
    }
  });

  playlist.currentItem(initialIndex);

  return playlist;
};

exports['default'] = factory;
module.exports = exports['default'];