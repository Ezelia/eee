import {System} from '../core/System';
import {IScheduler} from '../core/IScheduler';

export class RAFScheduler implements IScheduler {
    public systems: System[] = [];
    private _paused: boolean = false;  
    private _tick:FrameRequestCallback; 
    private _RAFHandler; 
    constructor(public engine) {
        this._tick =  this.tick.bind(this);        
    }
    public tick(timestamp: number) {
        
        //if (this.stop) return; //exit RAF

        this.engine.dtime = timestamp - this.engine.time;
        this.engine.time = timestamp;

        if (!this._paused) {
            for (var i = 0; i < this.systems.length; i++) {
                var mod = <System>this.systems[i];
                if (mod && mod.enabled) {
                    mod.update();
                }
            }
        }
        this._RAFHandler = requestAnimationFrame(this._tick);
    }
    
    public pause() {
        this._paused = true;
    }
    public resume() {
        this._paused = false;
    }
    public stop() {
        if (this._RAFHandler) cancelAnimationFrame(this._RAFHandler);
        this._RAFHandler = undefined;
    }
    public start() {
        this.engine.time = performance.now();
        this._tick(this.engine.time);
    }

    public updateSystems(systems: System[]) {
        this.systems = systems.filter(system => system.schedulable === true)//modules.slice(0);
    }
    

    public add(system: System) {
        this.systems.push(system);
    }
    public remove(system: System) {
        const idx = this.systems.indexOf(system);
        if (idx < 0) return null;
        const removed = this.systems.splice(idx, 1);
        return removed;
    }
    public sortSystems(sysOrder: any) {
        
        this.systems.sort(function (m1: System, m2: System) {
            var v1 = sysOrder[m1.id] || 1000;
            var v2 = sysOrder[m2.id] || 1000;

            return v1 - v2;

        });
    }
}