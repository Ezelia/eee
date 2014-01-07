var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var modules;
(function (modules) {
    var Physics = (function (_super) {
        __extends(Physics, _super);
        function Physics(gravity) {
            if (typeof gravity === "undefined") { gravity = 10; }
            _super.call(this, [], [CRigidBox, CPosition]);
            this.gravity = gravity;
            this.friction = 0.8;
        }
        Physics.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this.lastTime = eee.Engine.time;
        };

        Physics.prototype.updateEntity = function (entity) {
            var rbody = entity.get(CRigidBox);
            var pos = entity.get(CPosition);
            var size = entity.get(CSize);

            if (!rbody.isground) {
                pos.y += (this.deltaTime * this.gravity) / (1000 / 60); //60 FPS

                if (pos.y >= 600 - size.height) {
                    pos.y = 600 - size.height;
                }
            }
        };

        Physics.prototype.update = function () {
            this.deltaTime = eee.Engine.time - this.lastTime;

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.updateEntity(entity);
            }

            this.lastTime = eee.Engine.time;
        };
        return Physics;
    })(eee.TModule);
    modules.Physics = Physics;
})(modules || (modules = {}));
//# sourceMappingURL=Physics.js.map
