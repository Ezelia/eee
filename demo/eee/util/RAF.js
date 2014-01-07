// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function (window) {
    'use strict';

    if (navigator.isCocoonJS)
        return;

    var lastTime = 0, vendors = ['moz', 'webkit', 'o', 'ms'], x;

    for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    // Check if full standard supported
    if (!window.cancelAnimationFrame) {
        // Check if standard partially supported
        if (!window.requestAnimationFrame) {
            // No support, emulate standard
            window.requestAnimationFrame = function (callback) {
                var now = new Date().getTime(), nextTime = Math.max(lastTime + 16, now);

                return window.setTimeout(function () {
                    callback(lastTime = nextTime);
                }, nextTime - now);
            };

            window.cancelAnimationFrame = window.clearTimeout;
        } else {
            // Emulate cancel for browsers that don't support it
            var vendorsRAF = window.requestAnimationFrame;
            var lastTime = {};

            window.requestAnimationFrame = function (callback) {
                var id = x;
                x += 1;
                lastTime[id] = callback;

                // Call the vendors requestAnimationFrame implementation
                vendorsRAF(function (timestamp) {
                    if (lastTime.hasOwnProperty(id)) {
                        var error;
                        try  {
                            lastTime[id](timestamp);
                        } catch (e) {
                            error = e;
                        } finally {
                            delete lastTime[id];
                            if (error) {
                                throw error;
                            }
                        }
                    }
                });

                // return the id for cancellation capabilities
                return id;
            };

            window.cancelAnimationFrame = function (id) {
                delete lastTime[id];
            };
        }
    }
}(this));
//# sourceMappingURL=RAF.js.map
