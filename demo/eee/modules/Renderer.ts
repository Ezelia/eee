module modules {
    export class Renderer extends eee.TModule {

        public ctx: CanvasRenderingContext2D;

        private cWidth: number;
        private cHeight: number;

        private viewport =  { x1: 0, y1: 0, x2: 0, y2: 0 };
        constructor(public canvas: HTMLCanvasElement) {
            super([], [CSkin]);
            this.ctx = canvas.getContext('2d');
            this.cWidth = canvas.width;
            this.cHeight = canvas.height;

            this.viewport.x2 = this.cWidth;
            this.viewport.y2 = this.cHeight;

        }
        public init() {
            var _this = this;
            super.init();

        }

        private isInViewPort(pos: CPosition, size: CSize) {
            if (pos.x + size.width / 2 < this.viewport.x1 || pos.y + size.height < this.viewport.y1) return false;
            if (pos.x - size.width / 2 > this.viewport.x2 || pos.y - size.height > this.viewport.y2) return false;

            return true;
        }

        public drawEntity(entity: eee.Entity) {
            var pos: CPosition = entity.get(CPosition);
            var size: CSize = entity.get(CSize);

            if (!this.isInViewPort(pos, size)) return;

            var x = pos.x - size.width / 2;
            var y = pos.y - size.height / 2;

            this.ctx.fillRect(x, y, size.width, size.height);
        }


 


        public update() {
            this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.drawEntity(entity);

            }

        }
    }
}