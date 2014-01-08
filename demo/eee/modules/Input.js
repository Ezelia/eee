var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var modules;
(function (modules) {
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input() {
            _super.call(this, [], [CInput]);
            this.keys = [];
            this.keyEventUpdate = false;

            this.registerEvent('keyUpdate');
        }
        Input.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);

            this.setupKeyboardEventsListener();
        };

        Input.prototype.setupKeyboardEventsListener = function () {
            var _this = this;
            document.body.addEventListener("keydown", function (e) {
                _this.keys[e.keyCode] = true;
                _this.keyEventUpdate = true;
            });

            document.body.addEventListener("keyup", function (e) {
                _this.keys[e.keyCode] = false;
                _this.keyEventUpdate = true;
            });
        };

        Input.prototype.updateEntity = function (entity) {
            if (this.keyEventUpdate) {
                var input = entity.get(CInput);

                //input.keys = this.keys; //TODO : update entity keys instead of referencing Module keys
                this.triggerBehaviour('keyUpdate', entity, this.keys);
            }
        };
        Input.prototype.update = function () {
            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.updateEntity(entity);
            }

            this.keyEventUpdate = false;
        };
        return Input;
    })(eee.TModule);
    modules.Input = Input;
})(modules || (modules = {}));
//# sourceMappingURL=Input.js.map
