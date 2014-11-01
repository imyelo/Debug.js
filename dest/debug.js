(function umd(require){
  if ('object' == typeof exports) {
    module.exports = require('1');
  } else if ('function' == typeof define && define.amd) {
    define(function(){ return require('1'); });
  } else {
    this['debug'] = require('1');
  }
})((function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
// Debug:
//   print:
//     Debug(name, [withTrace])(obj, [obj, ...])
//   enable:
//     Debug.enable()
//   disable:
//     Debug.disable()
//     Debug.disable(name, [name, ...])
//   only:
//     Debug.only(name, [name, ...])
var Debug = (function () {
  var COLOR = {
    prefix: '#f47920',
    timestamp: '#FE5000'
  };
  var STORE = 'debug';
  var NOOP = function () {};
  var setting = {
    enabled: false,
    disabled: [],
    only: []
  };
  var init, color, store, timestamp, Debug;
  var console, log, trace;

  init = function () {
    if (!window.console || !window.console.log) {
      Debug = function () {
        return NOOP;
      };
      Debug.enable = Debug.only = Debug.disable = NOOP;
      return Debug;
    }
    console = window.console;
    log = console.log;
    trace = console.trace || function () {};
  };

  color = function (hex) {
    return 'color: ' + hex + ';';
  };

  store = {
    read: function () {
      try {
        if (window.localStorage) {
          setting.enabled = JSON.parse(localStorage.getItem(STORE + ':setting')).enabled;
        }
      } catch (e) {}
    },
    update: function () {
      try {
        if (window.localStorage) {
          localStorage.setItem(STORE + ':setting', JSON.stringify(setting));
        }
      } catch (e) {}
    }
  };

  timestamp = (function () {
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var cache = {};
    var get = function (ns) {
      var previous;
      if (typeof cache[ns] === 'undefined') {
        cache[ns] = +new Date();
        return 0;
      }
      previous = cache[ns];
      cache[ns] = +new Date();
      return cache[ns] - previous;
    };
    return function (ns) {
      return '+' + get(ns) + 'ms';
    };
  })();

  Debug = function (ns, withTrace) {
    return function () {
      var args, first;
      if (!setting.enabled) {
        return;
      }
      if (setting.only.length > 0) {
        if (setting.only.indexOf(ns) === -1) {
          return;
        }
      } else {
        if (setting.disabled.indexOf(ns) > -1) {
          return;
        }
      }
      args = Array.prototype.slice.call(arguments);
      first = args[0];
      try {
        log.apply(console, ['%c[debug - ' + ns + ' %c' + timestamp(ns) + '%c]%c']
          .concat([color(COLOR.prefix), color(COLOR.timestamp), color(COLOR.prefix), ''])
          .concat(args)
          );
      } catch (e) {
        log.apply(console, ['[debug - ' + ns + ' ' + timestamp(ns) + ']'].concat(args));
      }
      if (withTrace) {
        trace.call(console);
      }
    };
  };
  Debug.enable = function () {
    setting.enabled = true;
    store.update();
  };
  Debug.only = function () {
    var args = Array.prototype.slice.call(arguments);
    var i, length;
    for (i = 0, len = args.length; i < len; i++) {
      if (setting.only.indexOf(args[i]) === -1) {
        setting.only.push(args[i]);
      }
    }
  };
  Debug.disable = function () {
    var args = Array.prototype.slice.call(arguments);
    var i, len;
    if (args.length === 0) {
      setting.enabled = false;
      store.update();
    }
    for (i = 0, len = args.length; i < len; i++) {
      if (setting.disabled.indexOf(args[i]) === -1) {
        setting.disabled.push(args[i]);
      }
    }
  };
  Debug.reload = function () {
    init();
  };

  init();

  store.read();

  return Debug;
})();

Debug('Debug', true)('^ ^');

module.exports = Debug;


}, {}]}, {}, {"1":""})
);