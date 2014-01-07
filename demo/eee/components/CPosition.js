var CPosition = (function () {
    function CPosition(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    CPosition.__label__ = 'pos';
    return CPosition;
})();
//# sourceMappingURL=CPosition.js.map
