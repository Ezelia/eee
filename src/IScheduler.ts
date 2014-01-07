module eee {
    export interface IScheduler {
        tick();
        updateModules(modules: TModule[]);
    }
}