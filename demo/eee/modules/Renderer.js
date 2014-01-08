var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var modules;
(function (modules) {
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer(canvas) {
            _super.call(this, [], [CSkin]);
            this.canvas = canvas;
            this.viewport = { x1: 0, y1: 0, x2: 0, y2: 0 };
            this.ctx = canvas.getContext('2d');
            this.cWidth = canvas.width;
            this.cHeight = canvas.height;

            this.viewport.x2 = this.cWidth;
            this.viewport.y2 = this.cHeight;
        }
        Renderer.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
        };

        Renderer.prototype.isInViewPort = function (pos, size) {
            if (pos.x + size.width / 2 < this.viewport.x1 || pos.y + size.height < this.viewport.y1)
                return false;
            if (pos.x - size.width / 2 > this.viewport.x2 || pos.y - size.height > this.viewport.y2)
                return false;

            return true;
        };

        Renderer.prototype.drawEntity = function (entity) {
            var pos = entity.get(CPosition);
            var size = entity.get(CSize);

            if (!this.isInViewPort(pos, size))
                return;

            var skin = entity.get(CSkin);

            var x = pos.x - size.width / 2;
            var y = pos.y - size.height / 2;

            this.ctx.save();
            this.ctx.fillStyle = skin.color;
            this.ctx.fillRect(x, y, size.width, size.height);
            this.ctx.restore();
        };

        Renderer.prototype.update = function () {
            this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.drawEntity(entity);
            }
        };
        return Renderer;
    })(eee.TModule);
    modules.Renderer = Renderer;
})(modules || (modules = {}));
//# sourceMappingURL=Renderer.js.map
