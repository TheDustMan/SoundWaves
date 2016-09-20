// ./my-project/square-numbers.js
// Squares a list of numbers

// Require the underscore npm module
var _ = require('underscore');

function squareNumbers (list) {
    return _.map(list, function (n) { return n*n; });
}

//export squareNumbers as the module function
module.exports = squareNumbers;