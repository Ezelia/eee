class CPhysicsBody implements eee.IComponent {
    static __label__ = 'rbox';

    public jumping: boolean = false;
    public grounded: boolean = false;

    //velocity
    public vx: number = 0;
    public vy: number = 0; 

    //
    public speed: number = 15;

    constructor(
        public x1: number = 0,
        public y1: number = 0,
        public x2: number = 0,
        public y2: number = 0,
        public isground: boolean = false
        ) { }
}