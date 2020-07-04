export function getTypeName(t) {
    if (typeof t == 'string') return t;
    if (typeof t.name == 'string' && t.name !== 'Function') return t.name;
    return /\W*function\s+([\w\$]+)\(/.exec(t.toString())[1];
}

var idx = 0;
export function getGUID() {
    return idx++;
}
