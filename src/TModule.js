/// <reference path="EventHandler.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var eee;
(function (eee) {
    var TModule = (function (_super) {
        __extends(TModule, _super);
        function TModule(dependency, components) {
            _super.call(this);
            this.entities = [];

            this.id = util.getTypeName(this.constructor);
            this.dependency = dependency;
            this.components = components;
        }
        TModule.prototype.init = function () {
            console.log('Init Module ', this.id);
            if (this.dependency) {
                for (var i = 0; i < this.dependency.length; i++) {
                    var depName = util.getTypeName(this.dependency[i]);

                    console.log('  .dep ', depName);
                    if (!eee.Engine.data.modules.hasKey(depName)) {
                        console.warn('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch was not loaded');
                        //throw new Error('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch is not loaded');
                    }
                }
            }

            for (var i = 0; i < eee.Engine.data.entities.values.length; i++) {
                this.registerEntity(eee.Engine.data.entities.values[i]);
            }
        };

        TModule.prototype.registerEntity = function (entity) {
            if (this.components && this.entities.indexOf(entity.id) < 0 && entity.hasAll(this.components))
                return this.entities.push(entity.id);
        };
        TModule.prototype.unregisterEntity = function (entity) {
            //this.entities[this.entities.indexOf(entityId)] = undefined;
            //console.log('removing entity ', entityId, ' from module ', this.id);
            //we should maybe use a faster datastructure to avoid slice() ?
            ////console.warn('!!! this need to be tested # module name=', this.id);
            var idx = this.entities.indexOf(entity.id);

            if (idx != -1)
                this.entities.splice(idx, 1);
        };

        TModule.prototype.update = function () {
        };
        return TModule;
    })(eee.EventHandler);
    eee.TModule = TModule;
})(eee || (eee = {}));
//# sourceMappingURL=TModule.js.map
