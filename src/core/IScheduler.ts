import {System} from './System'
export interface IScheduler {
    tick(timestamp: number);
    updateSystems(systems: System[]);
    sortSystems(sysOrder: any);
    add(system: (System | System[]));
    remove(system: System);
    pause();
    resume();
    stop();
    start();
}
