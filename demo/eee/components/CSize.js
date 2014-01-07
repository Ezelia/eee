var CSize = (function () {
    function CSize(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this.width = width;
        this.height = height;
    }
    CSize.__label__ = 'size';
    return CSize;
})();
//# sourceMappingURL=CSize.js.map
