var util;
(function (util) {
    function getTypeName(t) {
        return /\W*function\s+([\w\$]+)\(/.exec(t.toString())[1];
    }
    util.getTypeName = getTypeName;
    function getGUID() {
        //thank's to StackOverflow community : http://stackoverflow.com/a/2117523 (:
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        return guid;
    }
    util.getGUID = getGUID;
})(util || (util = {}));
//# sourceMappingURL=util.js.map
