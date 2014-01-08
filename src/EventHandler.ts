module eee {
    export class EventHandler {
        // make module able to trigger custom events
        // ========================================================================================
        private _events: any;

        bind(event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        }
        //same as bind
        on(event, fct) {
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        }

        unbind(event, fct) {
            this._events = this._events || {};
            if (event in this._events === false) return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        }
        unbindEvent(event) {
            this._events = this._events || {};
            this._events[event] = [];
        }
        unbindAll() {
            this._events = this._events || {};
            for (var event in this._events) this._events[event] = false;
        }
        trigger(event, ...args: any[]) {
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

        }
        triggerBehaviour(event, entity: Entity, ...args: any[]) {
            var behaviour: CBehaviour = entity.get(CBehaviour);

            if (behaviour
                && behaviour.behaviourClass instanceof TBehaviour
                && typeof behaviour.behaviourClass[event] == 'function') {
                console.log('!!experimental!! trigger behaviour');


                var bhvclass = behaviour.behaviourClass;
                bhvclass.entity = entity;
                bhvclass[event].apply(bhvclass, args);
            }
        }
        registerEvent(evtname) {
            this[evtname] = function (callback, replace) {

                if (typeof callback == 'function') {
                    if (replace) this.unbindEvent(evtname);

                    this.bind(evtname, callback);
                }

                return this;
            };
        }
        // ====================================================================================
    }
}