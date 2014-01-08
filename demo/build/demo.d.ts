/// <reference path="../eee/eee.d.ts" />
declare class CSkin implements eee.IComponent {
    static __label__: string;
    public sprite: HTMLImageElement;
    constructor();
}
declare class CSize implements eee.IComponent {
    public width: number;
    public height: number;
    static __label__: string;
    constructor(width?: number, height?: number);
}
declare module util.DOM {
    function select(el: any): void;
    function getNumericStyleProperty(style: any, prop: any): number;
    function element_position(e: any): {
        x: number;
        y: number;
    };
    function triggerDomEvent(element: any, eventName: any, sender: any): void;
    function AddEvent(element: any, event_name: any, event_function: any): void;
    function Ready(fn: any): void;
}
declare class CRigidBox implements eee.IComponent {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    public isground: boolean;
    static __label__: string;
    public grounded: boolean;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number, isground?: boolean);
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
declare var player: eee.Entity;
declare module Ezelia.Germiz {
    class GameEngine extends eee.EventHandler {
        public settings: any;
        constructor(settings: any);
    }
}