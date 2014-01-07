/// <reference path="util/HashMap.ts" />
///<reference path='Entity.ts' />
///<reference path='TModule.ts' />
///<reference path='IComponent.ts' />
var eee;
(function (eee) {
    var Engine = (function () {
        function Engine() {
        }
        Engine.start = function (scheduler) {
            this.data.modules.each(function (mod) {
                mod.init();
            });

            if (scheduler)
                this.scheduler = scheduler;

            this.scheduler.updateModules(this.data.modules.values);
            if (this.scheduler)
                this.scheduler.tick();
        };

        Engine.createEntity = function () {
            var components = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                components[_i] = arguments[_i + 0];
            }
            var entity = new eee.Entity();
            for (var i = 0; i < components.length; i++)
                entity.add(components[i]);

            return entity;
        };

        /**
        *
        *
        *
        */
        Engine.checkModuleSignature = function (mod) {
            return (mod.init && mod.update && mod.registerEntity && mod.unregisterEntity);
        };
        Engine.insertModule = function (mod, id) {
            if (id !== undefined)
                mod.id = id;
            if (this.data.modules.hasKey(mod.id)) {
                console.warn('Module ', mod.id, 'already inserted ... ignored');
                return undefined;
            }
            if (!this.checkModuleSignature(mod)) {
                console.warn('bad module signature');
                return undefined;
            }
            this.data.modules.add(mod.id, mod);

            if (this.scheduler)
                this.scheduler.updateModules(this.data.modules.values);

            return mod.id;
        };
        Engine.removeModule = function (id) {
            var removed = this.data.modules.remove(id);
            if (this.scheduler)
                this.scheduler.updateModules(this.data.modules.values);

            return removed;
        };

        Engine.bind = function (event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        };

        //same as bind
        Engine.on = function (event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        };

        Engine.unbind = function (event, fct) {
            this._events = this._events || {};
            if (event in this._events === false)
                return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        };
        Engine.unbindEvent = function (event) {
            this._events = this._events || {};
            this._events[event] = [];
        };
        Engine.unbindAll = function () {
            this._events = this._events || {};
            for (var event in this._events)
                this._events[event] = false;
        };
        Engine.trigger = function (event) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            this._events = this._events || {};
            if (event in this._events === false)
                return;
            for (var i = 0; i < this._events[event].length; i++) {
                this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        };
        Engine.registerEvent = function (evtname) {
            this[evtname] = function (callback, replace) {
                if (typeof callback == 'function') {
                    if (replace)
                        this.unbindEvent(evtname);

                    this.bind(evtname, callback);
                }

                return this;
            };
        };
        Engine.time = Date.now();
        Engine.dtime = 0;

        Engine.data = {
            modules: new HashMap(),
            entities: new HashMap()
        };

        Engine.entitiesMap = [];
        return Engine;
    })();
    eee.Engine = Engine;
})(eee || (eee = {}));
//# sourceMappingURL=Engine.js.map
