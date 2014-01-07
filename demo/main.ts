/// <reference path="eee/eee.d.ts" />
util.DOM.Ready(function () {
});

var canvas = <HTMLCanvasElement>document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
document.body.appendChild(canvas);


var mPhysics = new modules.Physics(10);
var mRenderer = new modules.Renderer(canvas);

eee.Engine.insertModule(mPhysics);
eee.Engine.insertModule(mRenderer);

eee.Engine.start(RAFScheduler);



var player = new eee.Entity()
    .add(new CPosition(100, 100))
    .add(new CSize(20, 20))
    .add(new CSkin());

player.add(new CRigidBox(-10, -10, 10, 10, false));


