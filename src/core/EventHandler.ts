
export class EventHandler {
    // make module able to trigger custom events
    // ========================================================================================
    private _events: any;
    private _eventsOnce: any;


    bind(event, fct) {
        if (!fct) return;
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fct);
    }
    //same as bind
    on(event, fct, nbcalls?) {
        if (!fct) return;

        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        if (nbcalls) fct.__nbcalls__ = nbcalls;
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
        if (event in this._events === false || !this._events[event] || !(this._events[event] instanceof Array) ) return;
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
                var fct = this._events[event][i];

                if (!fct) continue; //Todo : typecheck ==> clean undefined ids

                fct.apply(this, args);

                if (fct.__nbcalls__ != undefined) {
                    fct.__nbcalls__--;
                    if (fct.__nbcalls__ <= 0) this.unbind(event, fct);
                }
            }
        }

        const anyEvent = '*';
        if (this._events[anyEvent]) {
            for (var i = 0; i < this._events[anyEvent].length; i++) {
                var fct = this._events[anyEvent][i];
                if (!fct) continue; //Todo : typecheck ==> clean undefined ids
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
        if (typeof this[evtname] == 'function') return this[evtname];
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
