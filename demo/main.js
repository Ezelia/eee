var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="eee/eee.d.ts" />
var canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);

var mPhysics = new modules.Physics(2);
var mRenderer = new modules.Renderer(canvas);
var mInput = new modules.Input();

eee.Engine.insertModule(mInput);
eee.Engine.insertModule(mPhysics);
eee.Engine.insertModule(mRenderer);
eee.Engine.start(RAFScheduler);

var playerBhv = (function (_super) {
    __extends(playerBhv, _super);
    function playerBhv() {
        _super.apply(this, arguments);
    }
    playerBhv.prototype.keyUpdate = function (keys) {
        var input = this.entity.get(CInput);
        var pbody = this.entity.get(CPhysicsBody);

        input.keys.UP = keys[38];
        input.keys.LEFT = keys[37];
        input.keys.RIGHT = keys[39];
    };
    return playerBhv;
})(eee.TBehaviour);

var player = new eee.Entity().add(new CPosition(100, 500)).add(new CSize(20, 20)).add(new CPhysicsBody(-10, -10, 10, 10, false)).add(new CSkin('#f00')).add(new CInput()).add(new eee.CBehaviour(playerBhv));

//here we define another object keeping a reference to it (ground) so we can add components later
var ground = new eee.Entity().add(new CPosition(0, 550)).add(new CSize(400, 40)).add(new CSkin());

//we can add/remove components at any time :)
ground.add(new CPhysicsBody(-200, -20, 200, 20, true));

//if we only need to instantiate an entity with some component, we don't need to keep a reference
// this is another ground
new eee.Entity().add(new CPosition(300, 450)).add(new CSize(500, 40)).add(new CSkin('#009')).add(new CPhysicsBody(-250, -20, 250, 20, true));
//# sourceMappingURL=main.js.map
