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
            ////trigger behaviour events
            //if (args[0] instanceof Entity
            //    && args[0].behaviour
            //    && args[0].behaviour.behaviourClass instanceof TBehaviour
            //    && typeof args[0].behaviour.behaviourClass[event] == 'function') {
            //    console.log('!!experimental!! trigger behaviour');
            //    var bhvclass = args[0].behaviour.behaviourClass;
            //    bhvclass[event].apply(bhvclass, args);
            //}
        };
        EventHandler.prototype.triggerBehaviour = function (event, entity) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 2); _i++) {
                args[_i] = arguments[_i + 2];
            }
            var behaviour = entity.get(eee.CBehaviour);

            if (behaviour && behaviour.behaviourClass instanceof eee.TBehaviour && typeof behaviour.behaviourClass[event] == 'function') {
                console.log('!!experimental!! trigger behaviour');

                var bhvclass = behaviour.behaviourClass;
                bhvclass.entity = entity;
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
/// <reference path="EventHandler.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var eee;
(function (eee) {
    var TModule = (function (_super) {
        __extends(TModule, _super);
        function TModule(dependency, components) {
            _super.call(this);
            this.entities = [];

            this.id = util.getTypeName((this).constructor);
            this.dependency = dependency || [];
            this.components = components;
        }
        TModule.prototype.init = function () {
            //basic module dependency handling
            console.log('Init Module ', this.id);
            if (this.dependency) {
                for (var i = 0; i < this.dependency.length; i++) {
                    var depName = util.getTypeName(this.dependency[i]);

                    console.log('  .dep ', depName);
                    if (!eee.Engine.data.modules.hasKey(depName)) {
                        console.warn('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch was not loaded');
                        //throw new Error('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch is not loaded');
                    }
                }
            }

            for (var i = 0; i < eee.Engine.data.entities.values.length; i++) {
                this.registerEntity(eee.Engine.data.entities.values[i]);
            }
        };

        TModule.prototype.registerEntity = function (entity) {
            if (this.components && this.entities.indexOf(entity.id) < 0 && entity.hasAll(this.components))
                return this.entities.push(entity.id);
        };
        TModule.prototype.unregisterEntity = function (entity) {
            var idx = this.entities.indexOf(entity.id);

            if (idx != -1)
                this.entities.splice(idx, 1);
        };

        TModule.prototype.update = function () {
        };
        return TModule;
    })(eee.EventHandler);
    eee.TModule = TModule;
})(eee || (eee = {}));
/*
This is an experimental HashMap implementation with some features I needed and didn't found in JS default Arrays and Objects

Features :
* Direct acces too elements throught .get(key)
* fast keys or values iteration using for (;;) instead of for in syntax (http://jsperf.com/array-keys-vs-object-keys-iteration/3 )

*/
var HashMap = (function () {
    function HashMap() {
        this.length = 0;
        this.values = [];
        this.index = {};
        this.keys = [];
    }
    HashMap.prototype.add = function (key, value) {
        if (key === undefined && value === undefined)
            return undefined;

        var previous = undefined;

        if (this.hasKey(key)) {
            previous = this.values[this.index[key].data];
            this.values[this.index[key].data] = undefined;
            this.keys[this.index[key].key] = undefined;
        } else {
            this.length++;
        }

        //create a new index, this will replace existing one.
        this.index[key] = {
            data: this.values.push(value) - 1,
            key: this.keys.push(key) - 1
        };

        return previous;
    };

    HashMap.prototype.get = function (key) {
        if (this.hasKey(key))
            return this.values[this.index[key].data];
    };

    HashMap.prototype.hasKey = function (key) {
        return (this.index[key] !== undefined);
    };

    HashMap.prototype.remove = function (key) {
        if (this.hasKey(key)) {
            var previous = this.values[this.index[key].data];
            this.values[this.index[key].data] = undefined;
            this.keys[this.index[key].key] = undefined;

            this.length--;
            delete this.index[key];
            return previous;
        } else {
            return undefined;
        }
        //TODO : clean this.keys and this.values from undefined values when their size becomes too big
    };

    //helper function to iterate throught all values
    HashMap.prototype.each = function (fn) {
        if (typeof fn != 'function')
            return;
        for (var i = 0; i < this.values.length; i++) {
            fn(this.values[i]);
        }
    };

    HashMap.prototype.clear = function () {
        this.values.length = 0;
        this.index = {};
        this.keys.length = 0;
        this.length = 0;
    };
    return HashMap;
})();
var eee;
(function (eee) {
    var Entity = (function () {
        function Entity() {
            this.recyclable = false;
            this.id = util.getGUID();
            eee.Engine.data.entities.add(this.id, this);
        }
        Entity.prototype.free = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                (eee.Engine.data.modules.values[i]).unregisterEntity(this.id);
            }

            this.recyclable = true;
        };

        Entity.prototype.destroy = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                (eee.Engine.data.modules.values[i]).unregisterEntity(this);
            }
            eee.Engine.data.entities.remove(this.id);

            for (var c in this) {
                if (this[c].constructor.__label__)
                    delete this[c];
                //console.log(' >> ', c, 'is ', typeof this[c], this[c].__label__);
            }
            //Entity is now clean
            //TODO : recycle the entity in an entity pool
        };

        Entity.prototype.register = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                (eee.Engine.data.modules.values[i]).registerEntity(this);
            }
        };
        Entity.prototype.unregister = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                (eee.Engine.data.modules.values[i]).unregisterEntity(this);
            }
        };

        Entity.prototype.add = function (componentInstance) {
            if (!(componentInstance).constructor.__label__)
                (componentInstance).constructor.__label__ = util.getTypeName((componentInstance).constructor);

            var label = (componentInstance).constructor.__label__;
            if (!this[label]) {
                this[label] = componentInstance;

                //register entity in all corresponding modules
                this.register();
            }
            return this;
        };

        Entity.prototype.remove = function (componentType) {
            var label = (componentType).__label__;
            if (this[label]) {
                this[label] = undefined;

                this.unregister();
            }
            return this;
        };

        /**
        * Determins if the entity has a component of a given type
        *
        * @param {IComponent Type} componentType
        * @return {boolean} Returns true if entity has the given component
        */
        Entity.prototype.has = function (componentType) {
            //var label = ComponentManager.getLabel(cmpType);
            return (this[(componentType).__label__] !== undefined);
        };

        Entity.prototype.hasAll = function (components) {
            for (var i = 0; i < components.length; i++) {
                if (!this.has(components[i]))
                    return false;
            }
            return true;
        };

        /**
        * Get the bound component instance of the given type
        *
        * @param {IComponent Type} componentType
        * @return {IComponent} Returns the component instance
        */
        Entity.prototype.get = function (componentType) {
            //var label = ComponentManager.getLabel(cmpType);
            return this[(componentType).__label__];
        };
        return Entity;
    })();
    eee.Entity = Entity;
})(eee || (eee = {}));
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

        Engine.checkModuleSignature = /**
        *
        *
        *
        */
        function (mod) {
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

        Engine.on = //same as bind
        function (event, fct) {
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
var util;
(function (util) {
    function getTypeName(t) {
        return /\W*function\s+([\w\$]+)\(/.exec(t.toString())[1];
    }
    util.getTypeName = getTypeName;
    function getGUID() {
        //thank's to StackOverflow community : http://stackoverflow.com/a/2117523 (:
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        return guid;
    }
    util.getGUID = getGUID;
})(util || (util = {}));
var eee;
(function (eee) {
    var TBehaviour = (function () {
        function TBehaviour() {
        }
        TBehaviour.prototype.trigger = function (event, args) {
            if (typeof this[event] != 'function')
                return;
            this[event].apply(this, args);
        };
        return TBehaviour;
    })();
    eee.TBehaviour = TBehaviour;
})(eee || (eee = {}));
/// <reference path="../TBehaviour.ts" />
/// <reference path="../IComponent.ts" />
var eee;
(function (eee) {
    var CBehaviour = (function () {
        function CBehaviour(behaviourType) {
            if (behaviourType)
                this.behaviourClass = new behaviourType();
        }
        CBehaviour.__label__ = 'behaviour';
        return CBehaviour;
    })();
    eee.CBehaviour = CBehaviour;
})(eee || (eee = {}));
//# sourceMappingURL=eee.js.map
