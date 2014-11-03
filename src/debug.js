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
  Debug.isEnabled = function () {
    return !!setting.enabled;
  };

  init();

  store.read();

  return Debug;
})();

Debug('Debug', true)('^ ^');

module.exports = Debug;

