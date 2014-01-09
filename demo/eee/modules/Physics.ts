module modules {

    //this physics module is highly inspired from this tutorial
    //http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/

    //the physics modele is not perfect for a real platformer game 
    // but it's simple and easy to understand.

    export class Physics extends eee.TModule {

        private lastTime: number;
        private deltaTime: number;

        public friction: number = 0.8;
        constructor(public gravity=10) {
            super([], [CPhysicsBody, CPosition]);

        }
        public init() {
            var _this = this;
            super.init();
            this.lastTime = eee.Engine.time;
        }



        public updateEntity(entity: eee.Entity) {
            

            var pbody: CPhysicsBody = entity.get(CPhysicsBody);
            var pos: CPosition = entity.get(CPosition);
            var size: CSize = entity.get(CSize);

            var input: CInput = entity.get(CInput);
            



            if (!pbody.isground) {

                if (input.keys.UP ) {
                    // up arrow or space
                    if (!pbody.jumping && pbody.grounded) {
                        pbody.jumping = true;
                        pbody.grounded = false;

                        pbody.vy = -pbody.speed * 2;
                        pos.y -= 1;
                    }
                }
                if (input.keys.RIGHT) {
                    // right arrow
                    if (pbody.vx < pbody.speed) {
                        pbody.vx = pbody.jumping ? pbody.vx + 2 : pbody.vx+1;
                        
                    }
                }
                if (input.keys.LEFT) {         // left arrow
                    if (pbody.vx > -pbody.speed) {
                        pbody.vx = pbody.jumping ? pbody.vx - 2 : pbody.vx - 1;
                    }
                }
                

                pbody.vx *= this.friction;
                pbody.vy += (this.deltaTime * this.gravity) / (1000 / 60);

                pbody.grounded = false;

                var keys = this.entities;
                for (var i = 0; i < keys.length; i++) {
                    var entity2 = eee.Engine.data.entities.get(keys[i]);
                    //if (!entity2) continue;
                    //var pbody2: CPhysicsBody = entity2.get(CPhysicsBody);

                    var col = this.isColliding(entity, entity2);
                    if (!col) continue;

                    
                    var pbody2: CPhysicsBody = entity2.get(CPhysicsBody);
                    if (pbody2.isground) {  //colliding with a ground body
                        
                        switch (col.dir) {
                            case 'l':
                                pos.x += col.cx;

                                pbody.vx = 0;
                                pbody.jumping = false;

                                break;
                            case 'r':
                                pos.x -= col.cx;

                                pbody.vx = 0;
                                pbody.jumping = false;

                                break;
                            case 'b':
                                pos.y -= col.cy;

                                pbody.grounded = true;
                                pbody.jumping = false;
                                break;
                            case 't':
                                pos.y += col.cy;

                                pbody.vy *= -1;
                                break;
                        }

                    }
                    

                }

                if (pbody.grounded) {
                    pbody.vy = 0;
                }

                pos.x += pbody.vx;
                pos.y += pbody.vy;
                
                                

            }
        }


        public isColliding(entityA: eee.Entity, entityB: eee.Entity) {
            if (!entityA || !entityB) return null;
            var pbodyA: CPhysicsBody = entityA.get(CPhysicsBody);
            var posA: CPosition = entityA.get(CPosition);

            var pbodyB: CPhysicsBody = entityB.get(CPhysicsBody);
            var posB: CPosition = entityB.get(CPosition);

            // get the vectors to check against
            var vX = posA.x - posB.x;
            var vY = posA.y - posB.y;
            // add the half widths and half heights of the objects



            var hWidths = (pbodyA.x2 - pbodyA.x1 + pbodyB.x2 - pbodyB.x1) / 2;
            var hHeights = (pbodyA.y2 - pbodyA.y1 + pbodyB.y2 - pbodyB.y1) / 2;
            var colDir = '';

            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(vX) <= hWidths && Math.abs(vY) <= hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)
                var oX = hWidths - Math.abs(vX),
                    oY = hHeights - Math.abs(vY);
                if (oX >= oY) {
                    if (vY > 0) {
                        colDir = "t";
                        
                    } else {
                        colDir = "b";
                        
                    }
                } else {
                    if (vX > 0) {
                        colDir = "l";
                        
                    } else {
                        colDir = "r";
                        
                    }
                }
            }
            return { dir: colDir, cx: oX, cy: oY };
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