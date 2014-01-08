module modules {
    export class Input extends eee.TModule {

        private keys: any[] = [];
        private keyEventUpdate: boolean = false;
        constructor() {
            super([], [CInput]);

            this.registerEvent('keyUpdate');
            

        }
        public init() {
            var _this = this;
            super.init();

            this.setupKeyboardEventsListener();
        }


        private setupKeyboardEventsListener() {
            var _this = this;
            document.body.addEventListener("keydown", function (e) {
                _this.keys[e.keyCode] = true;
                _this.keyEventUpdate = true;

            });

            document.body.addEventListener("keyup", function (e) {
                _this.keys[e.keyCode] = false;
                _this.keyEventUpdate = true;
                
            });
        }





        public updateEntity(entity: eee.Entity) {
            if (this.keyEventUpdate) {
                var input: CInput = entity.get(CInput);

                //input.keys = this.keys; //TODO : update entity keys instead of referencing Module keys

                this.triggerBehaviour('keyUpdate', entity, this.keys);
            }
        }
        public update() {

            var keys = this.entities;
            for (var i = 0; i < keys.length; i++) {
                var entity = eee.Engine.data.entities.get(keys[i]);

                this.updateEntity(entity);

            }

            this.keyEventUpdate = false;
        }
    }
}