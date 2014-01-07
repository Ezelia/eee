var eee;
(function (eee) {
    var Entity = (function () {
        function Entity() {
            this.recyclable = false;
            this.id = util.getGUID();
            eee.Engine.data.entities.add(this.id, this);
        }
        Entity.prototype.free = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                eee.Engine.data.modules.values[i].unregisterEntity(this.id);
            }

            this.recyclable = true;
        };

        Entity.prototype.destroy = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                eee.Engine.data.modules.values[i].unregisterEntity(this);
            }
            eee.Engine.data.entities.remove(this.id);

            for (var c in this) {
                if (this[c].constructor.__label__)
                    delete this[c];
                //console.log(' >> ', c, 'is ', typeof this[c], this[c].__label__);
            }
            //Entity is now clean
            //TODO : recycle the entity in an entity pool
        };

        Entity.prototype.register = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                eee.Engine.data.modules.values[i].registerEntity(this);
            }
        };
        Entity.prototype.unregister = function () {
            for (var i = 0; i < eee.Engine.data.modules.values.length; i++) {
                if (!eee.Engine.data.modules.values[i])
                    continue;
                eee.Engine.data.modules.values[i].unregisterEntity(this);
            }
        };

        Entity.prototype.add = function (componentInstance) {
            if (!componentInstance.constructor.__label__)
                componentInstance.constructor.__label__ = util.getTypeName(componentInstance.constructor);

            var label = componentInstance.constructor.__label__;
            if (!this[label]) {
                this[label] = componentInstance;

                //register entity in all corresponding modules
                this.register();
            }
            return this;
        };

        Entity.prototype.remove = function (componentType) {
            var label = componentType.__label__;
            if (this[label]) {
                this[label] = undefined;

                this.unregister();
            }
            return this;
        };

        /**
        * Determins if the entity has a component of a given type
        *
        * @param {IComponent Type} componentType
        * @return {boolean} Returns true if entity has the given component
        */
        Entity.prototype.has = function (componentType) {
            //var label = ComponentManager.getLabel(cmpType);
            return (this[componentType.__label__] !== undefined);
        };

        Entity.prototype.hasAll = function (components) {
            for (var i = 0; i < components.length; i++) {
                if (!this.has(components[i]))
                    return false;
            }
            return true;
        };

        /**
        * Get the bound component instance of the given type
        *
        * @param {IComponent Type} componentType
        * @return {IComponent} Returns the component instance
        */
        Entity.prototype.get = function (componentType) {
            //var label = ComponentManager.getLabel(cmpType);
            return this[componentType.__label__];
        };
        return Entity;
    })();
    eee.Entity = Entity;
})(eee || (eee = {}));
//# sourceMappingURL=Entity.js.map
