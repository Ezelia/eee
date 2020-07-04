import {Engine} from './Engine';
import {EventHandler} from './EventHandler';
import {Entity} from './Entity';
import {HashMap} from '../utils/HashMap';
import * as helpers from '../utils/helpers';

export class System extends EventHandler {

    public entities: HashMap;
    public id;
    private dependency;
    public components;
    public engine: Engine;
    public schedulable: boolean = true;
    public enabled:boolean = true;
    constructor(dependency?: any[], components?: any[]) {
        super();

        this.id = helpers.getTypeName((<any>this).constructor);
        this.dependency = dependency || [];
        this.components = components;
        this.entities = new HashMap();
    }

    /**
     * This function is called when the engine insert the module
     * it's a good place to initialize module values and ensure it have all required parameters to run correctly
     * @param engine 
     */
    public bind(engine:Engine) {
        this.engine = engine;
    }
    public init() {
        //basic module dependency handling
        if (this.dependency) {
            for (var i = 0; i < this.dependency.length; i++) {

                var depName = helpers.getTypeName(this.dependency[i]);

                if (!this.engine.systems[depName]) {
                //if (!this.engine.systems.hasKey(depName)) {
                    console.warn('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch was not loaded');
                    //throw new Error('Dependency Error, module ' + this.id + ' depends on ' + depName + ' witch is not loaded');
                }
            }
        }

        for (let entity of this.engine.entities.values) {
            if (entity) this.registerEntity(entity);
        }
    }

    public registerEntity(entity: Entity): any {
        
        if (this.components && !this.entities.hasKey(entity.id) && entity.hasAll(this.components)) {
            
            this.entities.add(entity.id, entity);

            return true;
        }

    }

    public hasEntity(entity: Entity): boolean {
        return this.entities.hasKey(entity.id);
    }

    public unregisterEntity(entity: Entity) {
        return (this.entities.remove(entity.id) != undefined);

        /*
        var idx = this.entities.indexOf(entity.id);
        
        if (idx != -1)
        this.entities.splice(idx, 1);
        */
    }

    public update() {
    }



}
