/*
This is an experimental HashMap implementation with some features I needed and didn't found in JS default Arrays and Objects
Features :
* Direct acces too elements throught .get(key)
* fast keys or values iteration using for (;;) instead of for in syntax (http://jsperf.com/array-keys-vs-object-keys-iteration/3 )
*/
var HashMap = (function () {
    function HashMap() {
        this.length = 0;
        this.values = [];
        this.index = {};
        this.keys = [];
    }
    HashMap.prototype.add = function (key, value) {
        if (key === undefined && value === undefined)
            return undefined;

        var previous = undefined;

        //Are we replacing an existing element ?
        if (this.hasKey(key)) {
            previous = this.values[this.index[key].data];
            this.values[this.index[key].data] = undefined;
            this.keys[this.index[key].key] = undefined;
        } else {
            this.length++;
        }

        //create a new index, this will replace existing one.
        this.index[key] = {
            data: this.values.push(value) - 1,
            key: this.keys.push(key) - 1
        };

        return previous;
    };

    HashMap.prototype.get = function (key) {
        if (this.hasKey(key))
            return this.values[this.index[key].data];
    };

    HashMap.prototype.hasKey = function (key) {
        return (this.index[key] !== undefined);
    };

    HashMap.prototype.remove = function (key) {
        if (this.hasKey(key)) {
            var previous = this.values[this.index[key].data];
            this.values[this.index[key].data] = undefined;
            this.keys[this.index[key].key] = undefined;

            this.length--;
            delete this.index[key];
            return previous;
        } else {
            return undefined;
        }
        //TODO : clean this.keys and this.values from undefined values when their size becomes too big
    };

    //helper function to iterate throught all values
    HashMap.prototype.each = function (fn) {
        if (typeof fn != 'function')
            return;
        for (var i = 0; i < this.values.length; i++) {
            fn(this.values[i]);
        }
    };

    HashMap.prototype.clear = function () {
        this.values.length = 0;
        this.index = {};
        this.keys.length = 0;
        this.length = 0;
    };
    return HashMap;
})();
//# sourceMappingURL=HashMap.js.map
