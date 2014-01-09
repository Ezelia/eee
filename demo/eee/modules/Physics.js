var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var modules;
(function (modules) {
    //this physics module is highly inspired from this tutorial
    //http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
    //the physics modele is not perfect for a real platformer game
    // but it's simple and easy to understand.
    var Physics = (function (_super) {
        __extends(Physics, _super);
        function Physics(gravity) {
            if (typeof gravity === "undefined") { gravity = 10; }
            _super.call(this, [], [CPhysicsBody, CPosition]);
            this.gravity = gravity;
            this.friction = 0.8;
        }
        Physics.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this.lastTime = eee.Engine.time;
        };

        Physics.prototype.updateEntity = function (entity) {
            var pbody = entity.get(CPhysicsBody);
            var pos = entity.get(CPosition);
            var size = entity.get(CSize);

            var input = entity.get(CInput);

            if (!pbody.isground) {
                if (input.keys.UP) {
                    if (!pbody.jumping && pbody.grounded) {
                        pbody.jumping = true;
                        pbody.grounded = false;

                        pbody.vy = -pbody.speed * 2;
                        pos.y -= 1;
                    }
                }
                if (input.keys.RIGHT) {
                    if (pbody.vx < pbody.speed) {
                        pbody.vx = pbody.jumping ? pbody.vx + 2 : pbody.vx + 1;
                    }
                }
                if (input.keys.LEFT) {
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
                    if (!col)
                        continue;

                    var pbody2 = entity2.get(CPhysicsBody);
                    if (pbody2.isground) {
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
        };

        Physics.prototype.isColliding = function (entityA, entityB) {
            if (!entityA || !entityB)
                return null;
            var pbodyA = entityA.get(CPhysicsBody);
            var posA = entityA.get(CPosition);

            var pbodyB = entityB.get(CPhysicsBody);
            var posB = entityB.get(CPosition);

            // get the vectors to check against
            var vX = posA.x - posB.x;
            var vY = posA.y - posB.y;

            // add the half widths and half heights of the objects
            var hWidths = (pbodyA.x2 - pbodyA.x1 + pbodyB.x2 - pbodyB.x1) / 2;
            var hHeights = (pbodyA.y2 - pbodyA.y1 + pbodyB.y2 - pbodyB.y1) / 2;
            var colDir = '';

            if (Math.abs(vX) <= hWidths && Math.abs(vY) <= hHeights) {
                var oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);
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
