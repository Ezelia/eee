declare module eee {
    class EventHandler {
        private _events;
        public bind(event: any, fct: any): void;
        public on(event: any, fct: any): void;
        public unbind(event: any, fct: any): void;
        public unbindEvent(event: any): void;
        public unbindAll(): void;
        public trigger(event: any, ...args: any[]): void;
        public registerEvent(evtname: any): void;
    }
}
declare module eee {
    class TModule extends eee.EventHandler {
        public entities: any[];
        public id: any;
        private dependency;
        public components: any;
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
    public add(key: any, value: any): any;
    public get(key: any): any;
    public hasKey(key: any): boolean;
    public remove(key: any): any;
    public each(fn: any): void;
    public clear(): void;
}
declare module eee {
    class Entity {
        public recyclable: boolean;
        public id: any;
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
        public get(componentType: new(...args: any[]) => eee.IComponent): any;
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
        static insertModule(mod: eee.TModule, id?: string): any;
        static removeModule(id: any): any;
        private static _events;
        static bind(event: any, fct: any): void;
        static on(event: any, fct: any): void;
        static unbind(event: any, fct: any): void;
        static unbindEvent(event: any): void;
        static unbindAll(): void;
        static trigger(event: any, ...args: any[]): void;
        static registerEvent(evtname: any): void;
    }
}
declare module eee {
    interface IScheduler {
        tick(): any;
        updateModules(modules: eee.TModule[]): any;
    }
}
declare module util {
    function getTypeName(t: any): string;
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
}
