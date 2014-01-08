/// <reference path="EventHandler.ts" />

module eee {
    export class TModule extends EventHandler {


        public entities: any[] = [];
        public id;
        private dependency;
        public components;
        constructor(dependency: any[], components?: any[]) {
            super();

            this.id = util.getTypeName((<any>this).constructor);
            this.dependency = dependency;
            this.components = components;
        }
        public init() {
            //basic module dependency handling
            console.log('Init Module ', this.id);
            if (this.dependency) {
                for (var i = 0; i < this.dependency.length; i++) {

                    var depName = util.getTypeName(this.dependency[i]);

                    console.log('  .dep ', depName);
                    if (!Engine.data.modules.hasKey(depName)) {
                        console.warn('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch was not loaded');
                        //throw new Error('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch is not loaded');
                    }
                }
            }

            for (var i = 0; i < Engine.data.entities.values.length; i++) {
                this.registerEntity(Engine.data.entities.values[i]);
            }
        }

        public registerEntity(entity: Entity): any {
            if (this.components && this.entities.indexOf(entity.id) < 0 && entity.hasAll(this.components))
                return this.entities.push(entity.id);

        }
        public unregisterEntity(entity: Entity) {
            var idx = this.entities.indexOf(entity.id);
            
            if (idx != -1 /*&& this.components && entity.hasAll(this.components)*/)
                this.entities.splice(idx, 1);
        }

        public update() {
        }



    }
}