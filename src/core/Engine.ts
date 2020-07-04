import {EventHandler} from './EventHandler';
import {Entity} from './Entity';
import {System} from './System';
import {IComponent} from './IComponent';
import {IScheduler} from './IScheduler';
import {HashMap} from '../utils/HashMap';

/**
 * 
 */
export class Engine extends EventHandler {
    

    /**
     * Current engine time
     */
    public time: number = Math.round(performance.now());

    /**
     * Current delta time : delta time is the time difference between two system update cycles
     */
    public dtime: number = 0;

    /**
     * 
     */
    public scheduler: IScheduler;

    
    public systems = {};
    public systemsByType = {};
    public entities = new HashMap();
    



    public start(scheduler?: IScheduler): void {


        // this.systems.each(function (id:string, sys: System) {
        //     sys.init();
        // })
        for (let sysId in this.systems)
            this.systems[sysId].init();
        
        if (scheduler) this.scheduler = scheduler;


        //this.scheduler.updateSystems(this.systems.values);
        const systemsList = Object.keys(this.systems).map(key => this.systems[key]);
        this.scheduler.updateSystems(systemsList);

        if (this.scheduler) this.scheduler.start();
    }

    public pause() {
        this.scheduler.pause();
    }
    public resume() {
        this.scheduler.resume();
        // this.scheduler._stop = false;
        // if (this.scheduler) this.scheduler.tick();
    }


    public createEntity(...components: IComponent[]): Entity {
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
    private checkSystemSignature(mod: System) {
        return (mod.init && mod.update && mod.registerEntity && mod.unregisterEntity);
    }


    public insertSystem(sys: System, id?: string, schedule=true) {
        if (id !== undefined) sys.id = id;
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
        this.systemsByType[(<any>sys).constructor.name] = sys;

        sys.bind(this);
        sys.schedulable = schedule;
        //if (this.scheduler) this.scheduler.updateModules(this.modules.values);
        if (this.scheduler && schedule) this.scheduler.add(sys);

        sys.trigger('inserted', sys);

        return sys.id;
    }
    
    public removeSystem(id) {
        //var removed = this.systems.remove(id);
        const removed = this.systems[id].remove(id);

        if (removed && delete this.systems[id]) {
            delete this.systemsByType[(<any>removed).constructor.name];
            //if (this.scheduler) this.scheduler.updateModules(this.modules.values);
            if (this.scheduler && removed) this.scheduler.remove(removed);
            removed.engine = undefined;

            removed.trigger('removed', removed);
            return removed;
        }

        
    }

    public getSystem(id:string|Function):any {
        if (typeof id == 'string') return this.systems[id];
        else return this.systemsByType[id.name];
    }


}