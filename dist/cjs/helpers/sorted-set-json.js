/*can-connect@0.6.0-pre.20#helpers/sorted-set-json*/
var forEach = [].forEach;
var keys = Object.keys;
module.exports = function (set) {
    if (set == null) {
        return set;
    } else {
        var sorted = {};
        forEach.call(keys(set).sort(), function (prop) {
            sorted[prop] = set[prop];
        });
        return JSON.stringify(sorted);
    }
};
//# sourceMappingURL=sorted-set-json.js.map