class CRigidBox implements eee.IComponent {
    static __label__ = 'rbox';

    public grounded: boolean = false;

    constructor(
        public x1: number = 0,
        public y1: number = 0,
        public x2: number = 0,
        public y2: number = 0,
        public isground: boolean = false
        ) { }
}