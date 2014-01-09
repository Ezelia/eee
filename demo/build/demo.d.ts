/// <reference path="../eee/eee.d.ts" />
declare class CSkin implements eee.IComponent {
    public color: any;
    static __label__: string;
    public sprite: HTMLImageElement;
    constructor(color?: any);
}
declare class CSize implements eee.IComponent {
    public width: number;
    public height: number;
    static __label__: string;
    constructor(width?: number, height?: number);
}
declare module util.DOM {
    function select(el): void;
    function getNumericStyleProperty(style, prop): number;
    function element_position(e): {
        x: number;
        y: number;
    };
    function triggerDomEvent(element, eventName, sender): void;
    function AddEvent(element, event_name, event_function): void;
    function Ready(fn): void;
}
declare class CPhysicsBody implements eee.IComponent {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    public isground: boolean;
    static __label__: string;
    public jumping: boolean;
    public grounded: boolean;
    public wasleft: boolean;
    public wasright: boolean;
    public vx: number;
    public vy: number;
    public speed: number;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number, isground?: boolean);
}
declare class CInput implements eee.IComponent {
    static __label__: string;
    public keys: {
        UP: boolean;
        DOWN: boolean;
        LEFT: boolean;
        RIGHT: boolean;
    };
    constructor();
}
declare module modules {
    class Renderer extends eee.TModule {
        public canvas: HTMLCanvasElement;
        public ctx: CanvasRenderingContext2D;
        private cWidth;
        private cHeight;
        private viewport;
        constructor(canvas: HTMLCanvasElement);
        public init(): void;
        private isInViewPort(pos, size);
        public drawEntity(entity: eee.Entity): void;
        public update(): void;
    }
}
declare class CVelocity implements eee.IComponent {
    public x: number;
    public y: number;
    static __label__: string;
    constructor(x?: number, y?: number);
}
declare module modules {
    class Physics extends eee.TModule {
        public gravity: number;
        private lastTime;
        private deltaTime;
        public friction: number;
        constructor(gravity?: number);
        public init(): void;
        public updateEntity(entity: eee.Entity): void;
        public isColliding(entityA: eee.Entity, entityB: eee.Entity): {
            dir: string;
            cx: number;
            cy: number;
        };
        public update(): void;
    }
}
declare module modules {
    class Input extends eee.TModule {
        private keys;
        private keyEventUpdate;
        constructor();
        public init(): void;
        private setupKeyboardEventsListener();
        public updateEntity(entity: eee.Entity): void;
        public update(): void;
    }
}
declare class RAFScheduler {
    static modules: eee.TModule[];
    static tickCB: any;
    static tick(): void;
    static updateModules(modules: eee.TModule[]): void;
}
declare class CPosition implements eee.IComponent {
    public x: number;
    public y: number;
    static __label__: string;
    constructor(x?: number, y?: number);
}
declare var canvas: HTMLCanvasElement;
declare var mPhysics: modules.Physics;
declare var mRenderer: modules.Renderer;
declare var mInput: modules.Input;
declare class playerBhv extends eee.TBehaviour {
    public keyUpdate(keys): void;
}
declare var player: eee.Entity;
declare var ground: eee.Entity;
declare module Ezelia.Germiz {
    class GameEngine extends eee.EventHandler {
        public settings: any;
        constructor(settings: any);
    }
}
