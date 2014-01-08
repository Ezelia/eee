declare module eee {
    class EventHandler {
        private _events;
        public bind(event, fct): void;
        public on(event, fct): void;
        public unbind(event, fct): void;
        public unbindEvent(event): void;
        public unbindAll(): void;
        public trigger(event, ...args: any[]): void;
        public triggerBehaviour(event, entity: eee.Entity, ...args: any[]): void;
        public registerEvent(evtname): void;
    }
}
declare module eee {
    class TModule extends eee.EventHandler {
        public entities: any[];
        public id;
        private dependency;
        public components;
        constructor(dependency: any[], components?: any[]);
        public init(): void;
        public registerEntity(entity: eee.Entity): any;
        public unregisterEntity(entity: eee.Entity): void;
        public update(): void;
    }
}
declare class HashMap {
    public length: number;
    public values: any[];
    public keys: any[];
    public index: any;
    constructor();
    public add(key, value);
    public get(key);
    public hasKey(key): boolean;
    public remove(key);
    public each(fn): void;
    public clear(): void;
}
declare module eee {
    class Entity {
        public recyclable: boolean;
        public id;
        constructor();
        public free(): void;
        public destroy(): void;
        private register();
        private unregister();
        public add(componentInstance: eee.IComponent): Entity;
        public remove(componentType: new(...args: any[]) => eee.IComponent): Entity;
        /**
        * Determins if the entity has a component of a given type
        *
        * @param {IComponent Type} componentType
        * @return {boolean} Returns true if entity has the given component
        */
        public has(componentType: new(...args: any[]) => eee.IComponent): boolean;
        public hasAll(components: any[]): boolean;
        /**
        * Get the bound component instance of the given type
        *
        * @param {IComponent Type} componentType
        * @return {IComponent} Returns the component instance
        */
        public get(componentType: new(...args: any[]) => eee.IComponent);
    }
}
declare module eee {
    interface IComponent {
    }
}
declare module eee {
    class Engine {
        static scheduler: eee.IScheduler;
        static time: number;
        static dtime: number;
        static data: any;
        static entitiesMap: any[];
        static start(scheduler?: eee.IScheduler): void;
        static createEntity(...components: eee.IComponent[]): eee.Entity;
        /**
        *
        *
        *
        */
        private static checkModuleSignature(mod);
        static insertModule(mod: eee.TModule, id?: string);
        static removeModule(id);
        private static _events;
        static bind(event, fct): void;
        static on(event, fct): void;
        static unbind(event, fct): void;
        static unbindEvent(event): void;
        static unbindAll(): void;
        static trigger(event, ...args: any[]): void;
        static registerEvent(evtname): void;
    }
}
declare module eee {
    interface IScheduler {
        tick();
        updateModules(modules: eee.TModule[]);
    }
}
declare module util {
    function getTypeName(t): string;
    function getGUID(): string;
}
declare module eee {
    class TBehaviour {
        public entity: eee.Entity;
        constructor();
        public trigger(event: string, args?: any): void;
    }
}
declare module eee {
    class CBehaviour implements eee.IComponent {
        static __label__: string;
        public behaviourClass: eee.TBehaviour;
        constructor(behaviourType?: new() => eee.TBehaviour);
    }
}
