module modules {
    export class Physics extends eee.TModule {


        private lastTime: number;
        private deltaTime: number;

        public friction: number = 0.8;
        constructor(public gravity=10) {
            super([], [CRigidBox, CPosition]);

        }
        public init() {
            var _this = this;
            super.init();
            this.lastTime = eee.Engine.time;
        }



        public updateEntity(entity: eee.Entity) {
            

            var rbody: CRigidBox = entity.get(CRigidBox);
            var pos: CPosition = entity.get(CPosition);
            var size: CSize = entity.get(CSize);

            if (!rbody.isground) {
                pos.y += (this.deltaTime * this.gravity) / (1000 / 60);  //60 FPS


                if (pos.y >= 600 - size.height) {
                    pos.y = 600 - size.height;
                }
            }
        }





        public update() {
            this.deltaTime = eee.Engine.time - this.lastTime;

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.updateEntity(entity);

            }

            this.lastTime = eee.Engine.time;
        }
    }
}