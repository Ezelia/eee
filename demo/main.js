var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="eee/eee.d.ts" />
util.DOM.Ready(function () {
});

var playerBhv = (function (_super) {
    __extends(playerBhv, _super);
    function playerBhv() {
        _super.apply(this, arguments);
    }
    playerBhv.prototype.keyUpdate = function (keys) {
        var input = this.entity.get(CInput);
        var pbody = this.entity.get(CPhysicsBody);

        input.keys.UP = keys[38];
        input.keys.SPACE = keys[32];
        input.keys.LEFT = keys[37];
        input.keys.RIGHT = keys[39];
    };
    return playerBhv;
})(eee.TBehaviour);

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

var player = new eee.Entity().add(new CPosition(100, 500)).add(new CSize(20, 20)).add(new CInput()).add(new CSkin('#f00'));

player.add(new CPhysicsBody(-10, -10, 10, 10, false));

//var bhv = new playerBhv(player);
player.add(new eee.CBehaviour(playerBhv));

var ground = new eee.Entity().add(new CPosition(0, 550)).add(new CSize(400, 40)).add(new CInput()).add(new CSkin());

ground.add(new CPhysicsBody(-200, -20, 200, 20, true));

new eee.Entity().add(new CPosition(300, 350)).add(new CSize(500, 40)).add(new CInput()).add(new CSkin('#009')).add(new CPhysicsBody(-250, -20, 250, 20, true));
//# sourceMappingURL=main.js.map
