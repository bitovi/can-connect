/*can-connect@0.6.0-pre.26#helpers/set-add*/
var canSet = require('can-set');
module.exports = function (connection, setItems, items, item, algebra) {
    var index = canSet.index(setItems, items, item, algebra);
    if (index === undefined) {
        index = items.length;
    }
    var copy = items.slice(0);
    copy.splice(index, 0, item);
    return copy;
};
//# sourceMappingURL=set-add.js.map