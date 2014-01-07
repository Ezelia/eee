/// <reference path="../TBehaviour.ts" />
/// <reference path="../IComponent.ts" />
var eee;
(function (eee) {
    var CBehaviour = (function () {
        function CBehaviour(behaviourType) {
            if (behaviourType)
                this.behaviourClass = new behaviourType();
        }
        CBehaviour.__label__ = 'behaviour';
        return CBehaviour;
    })();
})(eee || (eee = {}));
//# sourceMappingURL=CBehaviour.js.map
