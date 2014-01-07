module eee {
    export class TBehaviour {
        public entity: eee.Entity;
        constructor() {
        }
        public trigger(event: string, args?: any) {
            if (typeof this[event] != 'function') return;
            this[event].apply(this, args);
        }
    }
}