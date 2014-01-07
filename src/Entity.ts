module eee {
    export class Entity {

        public recyclable: boolean = false;
        public id;
        constructor() {
            this.id = util.getGUID();
            Engine.data.entities.add(this.id, this);
        }

        public free() {
            for (var i = 0; i < Engine.data.modules.values.length; i++) {
                if (!Engine.data.modules.values[i]) continue; //case of removed module
                (<TModule>Engine.data.modules.values[i]).unregisterEntity(this.id);
            }

            this.recyclable = true;
        }

        public destroy() {

            //unregister from all modules
            for (var i = 0; i < Engine.data.modules.values.length; i++) {
                if (!Engine.data.modules.values[i]) continue; //case of removed module
                (<TModule>Engine.data.modules.values[i]).unregisterEntity(this);
            }
            Engine.data.entities.remove(this.id);


            //now remove all components from the entity
            for (var c in this) {
                if (this[c].constructor.__label__) delete this[c];
                //console.log(' >> ', c, 'is ', typeof this[c], this[c].__label__);
            }

            //Entity is now clean 

            //TODO : recycle the entity in an entity pool
        }

        private register() {
            for (var i = 0; i < Engine.data.modules.values.length; i++) {
                if (!Engine.data.modules.values[i]) continue; //case of removed module
                (<TModule>Engine.data.modules.values[i]).registerEntity(this);
            }
        }
        private unregister() {
            for (var i = 0; i < Engine.data.modules.values.length; i++) {
                if (!Engine.data.modules.values[i]) continue; //case of removed module
                (<TModule>Engine.data.modules.values[i]).unregisterEntity(this);
            }
        }

        add(componentInstance: IComponent): Entity {

            if (!(<any>componentInstance).constructor.__label__)
                (<any>componentInstance).constructor.__label__ = util.getTypeName((<any>componentInstance).constructor);

            var label = (<any>componentInstance).constructor.__label__;
            if (!this[label]) {
                this[label] = componentInstance;
                
                //register entity in all corresponding modules
                this.register();
            }
            return this;
        }

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
            return (this[(<any>componentType).__label__] !== undefined);
        }

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
}