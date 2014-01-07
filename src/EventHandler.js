var eee;
(function (eee) {
    var EventHandler = (function () {
        function EventHandler() {
        }
        EventHandler.prototype.bind = function (event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        };

        //same as bind
        EventHandler.prototype.on = function (event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        };

        EventHandler.prototype.unbind = function (event, fct) {
            this._events = this._events || {};
            if (event in this._events === false)
                return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        };
        EventHandler.prototype.unbindEvent = function (event) {
            this._events = this._events || {};
            this._events[event] = [];
        };
        EventHandler.prototype.unbindAll = function () {
            this._events = this._events || {};
            for (var event in this._events)
                this._events[event] = false;
        };
        EventHandler.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            this._events = this._events || {};
            if (event in this._events !== false) {
                for (var i = 0; i < this._events[event].length; i++) {
                    this._events[event][i].apply(this, args);
                }
            }

            //trigger behaviour events
            if (args[0] instanceof eee.Entity && args[0].behaviour && args[0].behaviour.behaviourClass instanceof eee.TBehaviour && typeof args[0].behaviour.behaviourClass[event] == 'function') {
                console.log('!!experimental!! trigger behaviour');

                var bhvclass = args[0].behaviour.behaviourClass;

                bhvclass[event].apply(bhvclass, args);
            }
        };
        EventHandler.prototype.registerEvent = function (evtname) {
            this[evtname] = function (callback, replace) {
                if (typeof callback == 'function') {
                    if (replace)
                        this.unbindEvent(evtname);

                    this.bind(evtname, callback);
                }

                return this;
            };
        };
        return EventHandler;
    })();
    eee.EventHandler = EventHandler;
})(eee || (eee = {}));
//# sourceMappingURL=EventHandler.js.map
