/// <reference path="eee/eee.d.ts" />



var canvas = <HTMLCanvasElement>document.createElement('canvas');
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





class playerBhv extends eee.TBehaviour {
    keyUpdate(keys) {

        var input: CInput = this.entity.get(CInput);
        var pbody: CPhysicsBody = this.entity.get(CPhysicsBody);

        input.keys.UP = keys[38];
        input.keys.LEFT = keys[37];
        input.keys.RIGHT = keys[39];
    }
}



var player = new eee.Entity()
    //position and size (the position indicate the center point of an object)
    .add(new CPosition(100, 500))
    .add(new CSize(20, 20))
    
    //the physicsbody coordinates are relative to object center
    .add(new CPhysicsBody(-10, -10, 10, 10, false))
    .add(new CSkin('#f00'))

    //Input component will handle known keys (here we have UP, LEFT and RIGHT)
    .add(new CInput())

    //CBehaviour is a predefined component indicating that modules cans trigger entity behaviours
    //a behaviour is an event but instead of handling it with an event listener, we handle it using
    //a behaviour class (see playerBhv class below) , each function of that class represent a behaviour
    //in the present example, the only defined behaviour is 'keyUpdate' and is triggered from modules/Input
    .add(new eee.CBehaviour(playerBhv));



//here we define another object keeping a reference to it (ground) so we can add components later
var ground = new eee.Entity()
    .add(new CPosition(0, 550))
    .add(new CSize(400, 40))
    .add(new CSkin());

//we can add/remove components at any time :)
ground.add(new CPhysicsBody(-200, -20, 200, 20, true));



//if we only need to instantiate an entity with some component, we don't need to keep a reference
// this is another ground
new eee.Entity()
    .add(new CPosition(300, 450))
    .add(new CSize(500, 40))
    .add(new CSkin('#009'))
    .add(new CPhysicsBody(-250, -20, 250, 20, true));




