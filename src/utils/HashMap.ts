/*
a HashMap implementation with some features I needed and didn't found in JS default Arrays and Objects
 
Features :
* Direct acces to elements throught .get(key)
* fast keys or values iteration using for (;;) syntax instead of for in syntax (http://jsperf.com/array-keys-vs-object-keys-iteration/3 )
 
*/
export class HashMap {
    public length: number = 0;

    //Values will be stored here giving fast iteration with a fro (;;) loop
    public values: any[];

    //Keys will be stored here giving fast iteration throught keys with a fro (;;) loop
    public keys: any[];

    //this is a map between keys and values to give fast direct access to an element knowing its key
    public index: any;


    constructor() {
        this.values = [];
        this.index = {};
        this.keys = [];
    }

    /*
     * Insert Item by key
     */
    add(key, value) {
        if (key === undefined && value === undefined) return undefined;

        var previous = undefined;

        //Are we replacing an existing element ?
        if (this.hasKey(key)) {
            previous = this.values[this.index[key]];
            this.values[this.index[key]] = undefined;
            this.keys[this.index[key]] = undefined;

        }
        else {
            this.length++;
        }

        //insert value
        this.values.push(value);
        //insert key and update index
        this.index[key] = this.keys.push(key) - 1;



        return previous;
    }


    /*
     * get item by key
     */
    get(key) {
        if (this.hasKey(key))
            return this.values[this.index[key]];
    }


    hasKey(key) {
        return (this.index[key] !== undefined);
    }

    /*
     * remove item by key
    */
    remove(key) {
        if (this.hasKey(key)) {
            var previous = this.values[this.index[key]];
            this.values[this.index[key]] = undefined;
            this.keys[this.index[key]] = undefined;


            //fix issue : when index[key] is not set to undefined, deleted keys still report as existing.
            this.index[key] = undefined;

            this.length--;
            //delete this.index[key];
            return previous;
        }
        else {
            return undefined;
        }


        //TODO : trigger rebuild
        //if (this.length * 2 < this.keys.length) this.rebuild();
    }

    /* Sort HashMap by values
    *
    */
    sort(cb) {
        var _this = this;
        var keysort: any;
        if (cb) {
            keysort = function (k1, k2) {
                return cb(_this.values[_this.index[k1]], _this.values[_this.index[k2]]);
            }
		}
        else {
            keysort = function (k1, k2) {
                //default sort
                if (_this.values[_this.index[k1]].toString() < _this.values[_this.index[k2]].toString())
                    return -1;
                if (_this.values[_this.index[k1]].toString() > _this.values[_this.index[k2]].toString())
                    return 1;

                return 0;
            }
		}

        // !! sort keys first as they rely on existing index !!
        this.keys.sort(keysort);

        //sort values
        this.values.sort(cb);

        //rebuild index
        this.rebuild();
    }


    /*
    * static function to filter undefined elements from array
    * internally used by rebuild() function
    */
    static filterUndef(n) {
        return n !== undefined;
    }

    /*
    * rebuild HashMap index
    */
    rebuild() {
        this.keys = this.keys.filter(HashMap.filterUndef);
        this.values = this.values.filter(HashMap.filterUndef);

        this.index = {};
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] !== undefined) {
                this.index[this.keys[i]] = i;
            }
        }
    }

    /*
    * helper function to iterate throught all values 
    * @param cb : callback function taking, called with key, value arguments
    */
    each(cb) {
        if (typeof cb != 'function') return;
        for (var i = 0; i < this.keys.length; i++) {
            cb(this.keys[i], this.values[i]);
        }
    }

    clear() {
        this.values.length = 0;
        this.index = {};
        this.keys.length = 0;
        this.length = 0;
    }


}