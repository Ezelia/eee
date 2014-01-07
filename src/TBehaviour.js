var eee;
(function (eee) {
    var TBehaviour = (function () {
        function TBehaviour() {
        }
        TBehaviour.prototype.trigger = function (event, args) {
            if (typeof this[event] != 'function')
                return;
            this[event].apply(this, args);
        };
        return TBehaviour;
    })();
    eee.TBehaviour = TBehaviour;
})(eee || (eee = {}));
//# sourceMappingURL=TBehaviour.js.map
