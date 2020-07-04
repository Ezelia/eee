import {EventHandler} from './EventHandler';
import {System} from './System';
import {IComponent} from './IComponent';
import {Engine} from './Engine';
import * as helpers from '../utils/helpers';


/**
 * 
 */
export class Entity extends EventHandler {

    public recyclable: boolean = false;
    public id;

    //public modules:any;
    constructor(public engine:Engine) {
        super();
        this.id = helpers.getGUID();
        this.engine.entities.add(this.id, this);
        //this.modules = {};
    }


    /**
     * Remove the entity from all systems and destroy it
     */
    public destroy() {

        //unregister from all modules
        // for (var i = 0; i < this.engine.systems.values.length; i++) {
        //     if (!this.engine.systems.values[i]) continue; //case of removed module
        //     (<System>this.engine.systems.values[i]).unregisterEntity(this);
        // }
        for (let sysId in this.engine.systems)             
            (<System>this.engine.systems[sysId]).unregisterEntity(this);
        
        this.engine.entities.remove(this.id);


        //now remove all components from the entity
        for (var component in this) {
            if (this[component].constructor['__label__']) delete this[component];
            //console.log(' >> ', c, 'is ', typeof this[c], this[c].__label__);
        }

        //Entity is now clean 

        this.recyclable = true;
        //TODO : recycle the entity in an entity pool
    }


    
    private register() {
        // for (var i = 0; i < this.engine.systems.values.length; i++) {
        //     if (!this.engine.systems.values[i]) continue; //case of removed module
        //     (<System>this.engine.systems.values[i]).registerEntity(this);
        // }
        for (let sysId in this.engine.systems)             
            (<System>this.engine.systems[sysId]).registerEntity(this);

    }
    
    /**
     * Unregisters the entity from the systems, this is used to cleanup entity before destroying it
     */
    private unregister() {
        // for (var i = 0; i < this.engine.systems.values.length; i++) {
        //     if (!this.engine.systems.values[i]) continue; //case of removed module

        //     var mdl = (<System>this.engine.systems.values[i]);

        //     if (mdl.components && mdl.entities.hasKey(this.id) && !this.hasAll(mdl.components))
        //         mdl.unregisterEntity(this);

            
        // }

        for (let sysId in this.engine.systems) {   

            const sys = (<System>this.engine.systems[sysId]);

            if (sys.components && sys.entities.hasKey(this.id) && !this.hasAll(sys.components))
                sys.unregisterEntity(this);
        }
    }

    /**
     * Adds the component of the given type to the entity
     * @param {IComponent Type} componentInstance 
     */
    add(componentInstance: IComponent): Entity {
        if (!componentInstance) return this;
        if (!(<any>componentInstance).constructor.__label__)
            (<any>componentInstance).constructor.__label__ = helpers.getTypeName((<any>componentInstance).constructor);

        var label = (<any>componentInstance).constructor.__label__;
        if (!this[label]) {
            this[label] = componentInstance;
            
            //register entity in all corresponding modules
            this.register();
        }
        return this;
    }

    /**
     * Removes the component
     * @param {IComponent Type} componentType 
     */
    remove(componentType: new (...args: any[]) => IComponent): Entity {
        var label = (<any>componentType).__label__;
        if (this[label]) {
            this[label] = undefined;



            this.unregister();
        }
        return this;
    }


    /**
    * Determins if the entity has a component of a given type
    * 
    * @param {IComponent Type} componentType 
    * @return {boolean} Returns true if entity has the given component
    */
    has(componentType: new (...args: any[]) => IComponent): boolean {
        //var label = ComponentManager.getLabel(cmpType);
        return componentType && (this[(<any>componentType).__label__] !== undefined);
    }

    /**
     * Determins if the entity has all the listed components
     * @param components 
     */
    hasAll(components: any[]): boolean {
        for (var i = 0; i < components.length; i++) {
            if (!this.has(components[i])) return false;
        }
        return true;
    }


    /**
    * Get the bound component instance of the given type
    * 
    * @param {IComponent Type} componentType 
    * @return {IComponent} Returns the component instance
    */
    get(componentType: new (...args: any[]) => IComponent) {
        //var label = ComponentManager.getLabel(cmpType);
        return this[(<any>componentType).__label__];
    }

}

