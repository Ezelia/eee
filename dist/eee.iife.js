var eee = (function (exports) {
    'use strict';

    class EventHandler {
        bind(event, fct) {
            if (!fct)
                return;
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        }
        //same as bind
        on(event, fct, nbcalls) {
            if (!fct)
                return;
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            if (nbcalls)
                fct.__nbcalls__ = nbcalls;
            this._events[event].push(fct);
        }
        //unbind(event, fct) {
        //    this._events = this._events || {};
        //    //if (event in this._events === false) return;
        //    if (event in this._events === false || typeof this._events[event] != 'array') return;
        //    this._events[event].splice(this._events[event].indexOf(fct), 1);
        //}
        unbind(event, fct) {
            this._events = this._events || {};
            if (event in this._events === false || !this._events[event] || !(this._events[event] instanceof Array))
                return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        }
        unbindEvent(event) {
            this._events = this._events || {};
            this._events[event] = [];
        }
        unbindAll() {
            this._events = this._events || {};
            for (var event in this._events)
                this._events[event] = false;
        }
        trigger(event, ...args) {
            this._events = this._events || {};
            if (event in this._events !== false) {
                for (var i = 0; i < this._events[event].length; i++) {
                    var fct = this._events[event][i];
                    if (!fct)
                        continue; //Todo : typecheck ==> clean undefined ids
                    fct.apply(this, args);
                    if (fct.__nbcalls__ != undefined) {
                        fct.__nbcalls__--;
                        if (fct.__nbcalls__ <= 0)
                            this.unbind(event, fct);
                    }
                }
            }
            const anyEvent = '*';
            if (this._events[anyEvent]) {
                for (var i = 0; i < this._events[anyEvent].length; i++) {
                    var fct = this._events[anyEvent][i];
                    if (!fct)
                        continue; //Todo : typecheck ==> clean undefined ids
                    args.unshift(event);
                    fct.apply(this, args);
                }
            }
        }
        //triggerBehaviour(event, entity: Entity, ...args: any[]) {
        //    var behaviour: CBehaviour = entity.get(CBehaviour);
        //    if (behaviour
        //        && behaviour.behaviourClass
        //        /*&& behaviour.behaviourClass instanceof TBehaviour*/
        //        && typeof behaviour.behaviourClass[event] == 'function') {
        //        //console.log('!!experimental!! trigger behaviour');
        //        var bhvclass = behaviour.behaviourClass;
        //        bhvclass.entity = entity;
        //        return bhvclass[event].apply(bhvclass, args);
        //    }
        //}
        registerEvent(evtname) {
            if (typeof this[evtname] == 'function')
                return this[evtname];
            this[evtname] = function (callback, replace) {
                if (typeof callback == 'function') {
                    if (replace)
                        this.unbindEvent(evtname);
                    this.bind(evtname, callback);
                }
                return this;
            };
        }
    }

    function getTypeName(t) {
        if (typeof t == 'string')
            return t;
        if (typeof t.name == 'string' && t.name !== 'Function')
            return t.name;
        return /\W*function\s+([\w\$]+)\(/.exec(t.toString())[1];
    }
    var idx = 0;
    function getGUID() {
        return idx++;
    }

    /**
     *
     */
    class Entity extends EventHandler {
        //public modules:any;
        constructor(engine) {
            super();
            this.engine = engine;
            this.recyclable = false;
            this.id = getGUID();
            this.engine.entities.add(this.id, this);
            //this.modules = {};
        }
        /**
         * Remove the entity from all systems and destroy it
         */
        destroy() {
            //unregister from all modules
            // for (var i = 0; i < this.engine.systems.values.length; i++) {
            //     if (!this.engine.systems.values[i]) continue; //case of removed module
            //     (<System>this.engine.systems.values[i]).unregisterEntity(this);
            // }
            for (let sysId in this.engine.systems)
                this.engine.systems[sysId].unregisterEntity(this);
            this.engine.entities.remove(this.id);
            //now remove all components from the entity
            for (var component in this) {
                if (this[component].constructor['__label__'])
                    delete this[component];
                //console.log(' >> ', c, 'is ', typeof this[c], this[c].__label__);
            }
            //Entity is now clean 
            this.recyclable = true;
            //TODO : recycle the entity in an entity pool
        }
        register() {
            // for (var i = 0; i < this.engine.systems.values.length; i++) {
            //     if (!this.engine.systems.values[i]) continue; //case of removed module
            //     (<System>this.engine.systems.values[i]).registerEntity(this);
            // }
            for (let sysId in this.engine.systems)
                this.engine.systems[sysId].registerEntity(this);
        }
        /**
         * Unregisters the entity from the systems, this is used to cleanup entity before destroying it
         */
        unregister() {
            // for (var i = 0; i < this.engine.systems.values.length; i++) {
            //     if (!this.engine.systems.values[i]) continue; //case of removed module
            //     var mdl = (<System>this.engine.systems.values[i]);
            //     if (mdl.components && mdl.entities.hasKey(this.id) && !this.hasAll(mdl.components))
            //         mdl.unregisterEntity(this);
            // }
            for (let sysId in this.engine.systems) {
                const sys = this.engine.systems[sysId];
                if (sys.components && sys.entities.hasKey(this.id) && !this.hasAll(sys.components))
                    sys.unregisterEntity(this);
            }
        }
        /**
         * Adds the component of the given type to the entity
         * @param {IComponent Type} componentInstance
         */
        add(componentInstance) {
            if (!componentInstance)
                return this;
            if (!componentInstance.constructor.__label__)
                componentInstance.constructor.__label__ = getTypeName(componentInstance.constructor);
            var label = componentInstance.constructor.__label__;
            if (!this[label]) {
                this[label] = componentInstance;
                //register entity in all corresponding modules
                this.register();
            }
            return this;
        }
        /**
         * Removes the component
         * @param {IComponent Type} componentType
         */
        remove(componentType) {
            var label = componentType.__label__;
            if (this[label]) {
                this[label] = undefined;
                this.unregister();
            }
            return this;
        }
        /**
        * Determins if the entity has a component of a given type
        *
        * @param {IComponent Type} componentType
        * @return {boolean} Returns true if entity has the given component
        */
        has(componentType) {
            //var label = ComponentManager.getLabel(cmpType);
            return componentType && (this[componentType.__label__] !== undefined);
        }
        /**
         * Determins if the entity has all the listed components
         * @param components
         */
        hasAll(components) {
            for (var i = 0; i < components.length; i++) {
                if (!this.has(components[i]))
                    return false;
            }
            return true;
        }
        /**
        * Get the bound component instance of the given type
        *
        * @param {IComponent Type} componentType
        * @return {IComponent} Returns the component instance
        */
        get(componentType) {
            //var label = ComponentManager.getLabel(cmpType);
            return this[componentType.__label__];
        }
    }

    /*
    a HashMap implementation with some features I needed and didn't found in JS default Arrays and Objects

    Features :
    * Direct acces to elements throught .get(key)
    * fast keys or values iteration using for (;;) syntax instead of for in syntax (http://jsperf.com/array-keys-vs-object-keys-iteration/3 )

    */
    class HashMap {
        constructor() {
            this.length = 0;
            this.values = [];
            this.index = {};
            this.keys = [];
        }
        /*
         * Insert Item by key
         */
        add(key, value) {
            if (key === undefined && value === undefined)
                return undefined;
            var previous = undefined;
            //Are we replacing an existing element ?
            if (this.hasKey(key)) {
                previous = this.values[this.index[key]];
                this.values[this.index[key]] = undefined;
                this.keys[this.index[key]] = undefined;
            }
            else {
                this.length++;
            }
            //insert value
            this.values.push(value);
            //insert key and update index
            this.index[key] = this.keys.push(key) - 1;
            return previous;
        }
        /*
         * get item by key
         */
        get(key) {
            if (this.hasKey(key))
                return this.values[this.index[key]];
        }
        hasKey(key) {
            return (this.index[key] !== undefined);
        }
        /*
         * remove item by key
        */
        remove(key) {
            if (this.hasKey(key)) {
                var previous = this.values[this.index[key]];
                this.values[this.index[key]] = undefined;
                this.keys[this.index[key]] = undefined;
                //fix issue : when index[key] is not set to undefined, deleted keys still report as existing.
                this.index[key] = undefined;
                this.length--;
                //delete this.index[key];
                return previous;
            }
            else {
                return undefined;
            }
            //TODO : trigger rebuild
            //if (this.length * 2 < this.keys.length) this.rebuild();
        }
        /* Sort HashMap by values
        *
        */
        sort(cb) {
            var _this = this;
            var keysort;
            if (cb) {
                keysort = function (k1, k2) {
                    return cb(_this.values[_this.index[k1]], _this.values[_this.index[k2]]);
                };
            }
            else {
                keysort = function (k1, k2) {
                    //default sort
                    if (_this.values[_this.index[k1]].toString() < _this.values[_this.index[k2]].toString())
                        return -1;
                    if (_this.values[_this.index[k1]].toString() > _this.values[_this.index[k2]].toString())
                        return 1;
                    return 0;
                };
            }
            // !! sort keys first as they rely on existing index !!
            this.keys.sort(keysort);
            //sort values
            this.values.sort(cb);
            //rebuild index
            this.rebuild();
        }
        /*
        * static function to filter undefined elements from array
        * internally used by rebuild() function
        */
        static filterUndef(n) {
            return n !== undefined;
        }
        /*
        * rebuild HashMap index
        */
        rebuild() {
            this.keys = this.keys.filter(HashMap.filterUndef);
            this.values = this.values.filter(HashMap.filterUndef);
            this.index = {};
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keys[i] !== undefined) {
                    this.index[this.keys[i]] = i;
                }
            }
        }
        /*
        * helper function to iterate throught all values
        * @param cb : callback function taking, called with key, value arguments
        */
        each(cb) {
            if (typeof cb != 'function')
                return;
            for (var i = 0; i < this.keys.length; i++) {
                cb(this.keys[i], this.values[i]);
            }
        }
        clear() {
            this.values.length = 0;
            this.index = {};
            this.keys.length = 0;
            this.length = 0;
        }
    }

    /**
     *
     */
    class Engine extends EventHandler {
        constructor() {
            super(...arguments);
            /**
             * Current engine time
             */
            this.time = Math.round(performance.now());
            /**
             * Current delta time : delta time is the time difference between two system update cycles
             */
            this.dtime = 0;
            this.systems = {};
            this.systemsByType = {};
            this.entities = new HashMap();
        }
        start(scheduler) {
            // this.systems.each(function (id:string, sys: System) {
            //     sys.init();
            // })
            for (let sysId in this.systems)
                this.systems[sysId].init();
            if (scheduler)
                this.scheduler = scheduler;
            //this.scheduler.updateSystems(this.systems.values);
            const systemsList = Object.keys(this.systems).map(key => this.systems[key]);
            this.scheduler.updateSystems(systemsList);
            if (this.scheduler)
                this.scheduler.start();
        }
        pause() {
            this.scheduler.pause();
        }
        resume() {
            this.scheduler.resume();
            // this.scheduler._stop = false;
            // if (this.scheduler) this.scheduler.tick();
        }
        createEntity(...components) {
            var entity = new Entity(this);
            for (var i = 0; i < components.length; i++)
                entity.add(components[i]);
            return entity;
        }
        /**
        *
        *
        *
        */
        checkSystemSignature(mod) {
            return (mod.init && mod.update && mod.registerEntity && mod.unregisterEntity);
        }
        insertSystem(sys, id, schedule = true) {
            if (id !== undefined)
                sys.id = id;
            //if (this.systems.hasKey(sys.id)) {
            if (this.systems[sys.id]) {
                console.warn('Module ', sys.id, 'already inserted ... ignored');
                return undefined;
            }
            if (!this.checkSystemSignature(sys)) {
                console.warn('bad module signature');
                return undefined;
            }
            //this.systems.add(sys.id, sys);
            this.systems[sys.id] = sys;
            this.systemsByType[sys.constructor.name] = sys;
            sys.bind(this);
            sys.schedulable = schedule;
            //if (this.scheduler) this.scheduler.updateModules(this.modules.values);
            if (this.scheduler && schedule)
                this.scheduler.add(sys);
            sys.trigger('inserted', sys);
            return sys.id;
        }
        removeSystem(id) {
            //var removed = this.systems.remove(id);
            const removed = this.systems[id].remove(id);
            if (removed && delete this.systems[id]) {
                delete this.systemsByType[removed.constructor.name];
                //if (this.scheduler) this.scheduler.updateModules(this.modules.values);
                if (this.scheduler && removed)
                    this.scheduler.remove(removed);
                removed.engine = undefined;
                removed.trigger('removed', removed);
                return removed;
            }
        }
        getSystem(id) {
            if (typeof id == 'string')
                return this.systems[id];
            else
                return this.systemsByType[id.name];
        }
    }

    class System extends EventHandler {
        constructor(dependency, components) {
            super();
            this.schedulable = true;
            this.enabled = true;
            this.id = getTypeName(this.constructor);
            this.dependency = dependency || [];
            this.components = components;
            this.entities = new HashMap();
        }
        /**
         * This function is called when the engine insert the module
         * it's a good place to initialize module values and ensure it have all required parameters to run correctly
         * @param engine
         */
        bind(engine) {
            this.engine = engine;
        }
        init() {
            //basic module dependency handling
            if (this.dependency) {
                for (var i = 0; i < this.dependency.length; i++) {
                    var depName = getTypeName(this.dependency[i]);
                    if (!this.engine.systems[depName]) {
                        //if (!this.engine.systems.hasKey(depName)) {
                        console.warn('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch was not loaded');
                        //throw new Error('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch is not loaded');
                    }
                }
            }
            for (let entity of this.engine.entities.values) {
                if (entity)
                    this.registerEntity(entity);
            }
        }
        registerEntity(entity) {
            if (this.components && !this.entities.hasKey(entity.id) && entity.hasAll(this.components)) {
                this.entities.add(entity.id, entity);
                return true;
            }
        }
        hasEntity(entity) {
            return this.entities.hasKey(entity.id);
        }
        unregisterEntity(entity) {
            return (this.entities.remove(entity.id) != undefined);
            /*
            var idx = this.entities.indexOf(entity.id);
            
            if (idx != -1)
            this.entities.splice(idx, 1);
            */
        }
        update() {
        }
    }

    class RAFScheduler {
        constructor(engine) {
            this.engine = engine;
            this.systems = [];
            this._paused = false;
            this._tick = this.tick.bind(this);
        }
        tick(timestamp) {
            //if (this.stop) return; //exit RAF
            this.engine.dtime = timestamp - this.engine.time;
            this.engine.time = timestamp;
            if (!this._paused) {
                for (var i = 0; i < this.systems.length; i++) {
                    var mod = this.systems[i];
                    if (mod && mod.enabled) {
                        mod.update();
                    }
                }
            }
            this._RAFHandler = requestAnimationFrame(this._tick);
        }
        pause() {
            this._paused = true;
        }
        resume() {
            this._paused = false;
        }
        stop() {
            if (this._RAFHandler)
                cancelAnimationFrame(this._RAFHandler);
            this._RAFHandler = undefined;
        }
        start() {
            this.engine.time = performance.now();
            this._tick(this.engine.time);
        }
        updateSystems(systems) {
            this.systems = systems.filter(system => system.schedulable === true); //modules.slice(0);
        }
        add(system) {
            this.systems.push(system);
        }
        remove(system) {
            const idx = this.systems.indexOf(system);
            if (idx < 0)
                return null;
            const removed = this.systems.splice(idx, 1);
            return removed;
        }
        sortSystems(sysOrder) {
            this.systems.sort(function (m1, m2) {
                var v1 = sysOrder[m1.id] || 1000;
                var v2 = sysOrder[m2.id] || 1000;
                return v1 - v2;
            });
        }
    }

    const utils = { HashMap };
    const schedulers = { RAFScheduler };
    //import * as _eee from './core';
    //export import eee= _eee;
    //export const eee = {Engine, Entity, System, EventHandler};
    //export const eee = {Engine, Entity, System, EventHandler, IComponent, IScheduler}

    exports.Engine = Engine;
    exports.Entity = Entity;
    exports.EventHandler = EventHandler;
    exports.System = System;
    exports.schedulers = schedulers;
    exports.utils = utils;

    return exports;

}({}));
