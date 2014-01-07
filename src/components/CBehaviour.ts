/// <reference path="../TBehaviour.ts" />
/// <reference path="../IComponent.ts" />

module eee {
    class CBehaviour implements IComponent {
        static __label__ = 'behaviour';
        public behaviourClass: TBehaviour;

        constructor(
            behaviourType?: new () => TBehaviour
            ) {
            if (behaviourType) this.behaviourClass = new behaviourType();

        }

    }
}