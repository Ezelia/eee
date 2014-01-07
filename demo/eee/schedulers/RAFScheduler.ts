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

        if (typeof this.tickCB == 'function') this.tickCB();
    }

    static updateModules(modules: eee.TModule[]) {
        this.modules = modules;
    }


}