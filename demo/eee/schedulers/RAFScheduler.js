var RAFScheduler = (function () {
    function RAFScheduler() {
    }
    RAFScheduler.tick = function () {
        eee.Engine.dtime = Date.now() - eee.Engine.time;
        eee.Engine.time = Date.now();

        for (var i = 0; i < RAFScheduler.modules.length; i++) {
            var mod = RAFScheduler.modules[i];
            if (mod)
                mod.update();
        }

        requestAnimationFrame(function () {
            RAFScheduler.tick();
        });
    };

    RAFScheduler.updateModules = //Used by eee.Engine when registering the scheduler
    function (modules) {
        this.modules = modules;
    };
    RAFScheduler.modules = [];
    return RAFScheduler;
})();
//# sourceMappingURL=RAFScheduler.js.map
