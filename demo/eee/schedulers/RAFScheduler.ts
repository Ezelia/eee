class RAFScheduler /*implements eee.IScheduler*/ {
    static modules: eee.TModule[] = [];
    static tickCB: any;

    static tick() {
        eee.Engine.dtime = Date.now() - eee.Engine.time;
        eee.Engine.time = Date.now();


        for (var i = 0; i < RAFScheduler.modules.length; i++) {
            var mod = <eee.TModule>RAFScheduler.modules[i];
            if (mod) mod.update();
        }

        requestAnimationFrame(function () { RAFScheduler.tick(); });
    }

    //Used by eee.Engine when registering the scheduler
    static updateModules(modules: eee.TModule[]) {
        this.modules = modules;
    }


}