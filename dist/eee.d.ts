declare class EventHandler {
    private _events;
    private _eventsOnce;
    bind(event: any, fct: any): void;
    on(event: any, fct: any, nbcalls?: any): void;
    unbind(event: any, fct: any): void;
    unbindEvent(event: any): void;
    unbindAll(): void;
    trigger(event: any, ...args: any[]): void;
    registerEvent(evtname: any): any;
}

interface IComponent {
}

/**
 *
 */
declare class Entity extends EventHandler {
    engine: Engine;
    recyclable: boolean;
    id: any;
    constructor(engine: Engine);
    /**
     * Remove the entity from all systems and destroy it
     */
    destroy(): void;
    private register;
    /**
     * Unregisters the entity from the systems, this is used to cleanup entity before destroying it
     */
    private unregister;
    /**
     * Adds the component of the given type to the entity
     * @param {IComponent Type} componentInstance
     */
    add(componentInstance: IComponent): Entity;
    /**
     * Removes the component
     * @param {IComponent Type} componentType
     */
    remove(componentType: new (...args: any[]) => IComponent): Entity;
    /**
    * Determins if the entity has a component of a given type
    *
    * @param {IComponent Type} componentType
    * @return {boolean} Returns true if entity has the given component
    */
    has(componentType: new (...args: any[]) => IComponent): boolean;
    /**
     * Determins if the entity has all the listed components
     * @param components
     */
    hasAll(components: any[]): boolean;
    /**
    * Get the bound component instance of the given type
    *
    * @param {IComponent Type} componentType
    * @return {IComponent} Returns the component instance
    */
    get(componentType: new (...args: any[]) => IComponent): any;
}

declare class HashMap {
    length: number;
    values: any[];
    keys: any[];
    index: any;
    constructor();
    add(key: any, value: any): any;
    get(key: any): any;
    hasKey(key: any): boolean;
    remove(key: any): any;
    sort(cb: any): void;
    static filterUndef(n: any): boolean;
    rebuild(): void;
    each(cb: any): void;
    clear(): void;
}

declare class System extends EventHandler {
    entities: HashMap;
    id: any;
    private dependency;
    components: any;
    engine: Engine;
    schedulable: boolean;
    enabled: boolean;
    constructor(dependency?: any[], components?: any[]);
    /**
     * This function is called when the engine insert the module
     * it's a good place to initialize module values and ensure it have all required parameters to run correctly
     * @param engine
     */
    bind(engine: Engine): void;
    init(): void;
    registerEntity(entity: Entity): any;
    hasEntity(entity: Entity): boolean;
    unregisterEntity(entity: Entity): boolean;
    update(): void;
}

interface IScheduler {
    tick(timestamp: number): any;
    updateSystems(systems: System[]): any;
    sortSystems(sysOrder: any): any;
    add(system: (System | System[])): any;
    remove(system: System): any;
    pause(): any;
    resume(): any;
    stop(): any;
    start(): any;
}

/**
 *
 */
declare class Engine extends EventHandler {
    /**
     * Current engine time
     */
    time: number;
    /**
     * Current delta time : delta time is the time difference between two system update cycles
     */
    dtime: number;
    /**
     *
     */
    scheduler: IScheduler;
    systems: {};
    systemsByType: {};
    entities: HashMap;
    start(scheduler?: IScheduler): void;
    pause(): void;
    resume(): void;
    createEntity(...components: IComponent[]): Entity;
    /**
    *
    *
    *
    */
    private checkSystemSignature;
    insertSystem(sys: System, id?: string, schedule?: boolean): any;
    removeSystem(id: any): any;
    getSystem(id: string | Function): any;
}

declare class RAFScheduler implements IScheduler {
    engine: any;
    systems: System[];
    private _paused;
    private _tick;
    private _RAFHandler;
    constructor(engine: any);
    tick(timestamp: number): void;
    pause(): void;
    resume(): void;
    stop(): void;
    start(): void;
    updateSystems(systems: System[]): void;
    add(system: System): void;
    remove(system: System): System[];
    sortSystems(sysOrder: any): void;
}

declare const utils: {
    HashMap: typeof HashMap;
};
declare const schedulers: {
    RAFScheduler: typeof RAFScheduler;
};

export { Engine, Entity, EventHandler, IComponent, IScheduler, System, schedulers, utils };
