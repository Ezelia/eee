/// <reference path="util/HashMap.ts" />
///<reference path='Entity.ts' />
///<reference path='TModule.ts' />
///<reference path='IComponent.ts' />



module eee {
    export class Engine {
        static scheduler: IScheduler;
        static time: number = Date.now();
        static dtime: number = 0;

        static data: any = {
            modules: new HashMap(),
            entities: new HashMap()
        };

        static entitiesMap: any[] = [];


        static start(scheduler?: IScheduler): void {

            this.data.modules.each(function (mod: TModule) {
                mod.init();
            })

            if (scheduler) this.scheduler = scheduler;

            this.scheduler.updateModules(this.data.modules.values);
            if (this.scheduler) this.scheduler.tick();
        }


        static createEntity(...components: IComponent[]): Entity {
            var entity = new Entity();
            for (var i = 0; i < components.length; i++)
                entity.add(components[i]);

            return entity;
        }


        /**
        * 
        *
        *
        */

        private static checkModuleSignature(mod: TModule) {
            return (mod.init && mod.update && mod.registerEntity && mod.unregisterEntity);
        }
        static insertModule(mod: TModule, id?: string) {
            if (id !== undefined) mod.id = id;
            if (this.data.modules.hasKey(mod.id)) {
                console.warn('Module ', mod.id, 'already inserted ... ignored');
                return undefined;
            }
            if (!this.checkModuleSignature(mod)) {
                console.warn('bad module signature');
                return undefined;
            }
            this.data.modules.add(mod.id, mod);

            if (this.scheduler) this.scheduler.updateModules(this.data.modules.values);


            return mod.id;
        }
        static removeModule(id) {
            var removed = this.data.modules.remove(id);
            if (this.scheduler) this.scheduler.updateModules(this.data.modules.values);


            return removed;
        }


        // make module able to trigger custom events
        // ========================================================================================
        private static _events: any;

        static bind(event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        }
        //same as bind
        static on(event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        }

        static unbind(event, fct) {
            this._events = this._events || {};
            if (event in this._events === false) return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        }
        static unbindEvent(event) {
            this._events = this._events || {};
            this._events[event] = [];
        }
        static unbindAll() {
            this._events = this._events || {};
            for (var event in this._events) this._events[event] = false;
        }
        static trigger(event, ...args: any[]) {
            this._events = this._events || {};
            if (event in this._events === false) return;
            for (var i = 0; i < this._events[event].length; i++) {
                this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
            }
        }
        static registerEvent(evtname) {
            this[evtname] = function (callback, replace) {

                if (typeof callback == 'function') {
                    if (replace) this.unbindEvent(evtname);

                    this.bind(evtname, callback);
                }

                return this;
            }
    }
        // ====================================================================================
    }
}