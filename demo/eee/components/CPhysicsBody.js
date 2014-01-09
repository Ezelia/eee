var CPhysicsBody = (function () {
    function CPhysicsBody(x1, y1, x2, y2, isground) {
        if (typeof x1 === "undefined") { x1 = 0; }
        if (typeof y1 === "undefined") { y1 = 0; }
        if (typeof x2 === "undefined") { x2 = 0; }
        if (typeof y2 === "undefined") { y2 = 0; }
        if (typeof isground === "undefined") { isground = false; }
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.isground = isground;
        this.jumping = false;
        this.grounded = false;
        this.wasleft = false;
        this.wasright = false;
        //velocity
        this.vx = 0;
        this.vy = 0;
        //
        this.speed = 12;
    }
    CPhysicsBody.__label__ = 'pbody';
    return CPhysicsBody;
})();
//# sourceMappingURL=CPhysicsBody.js.map
