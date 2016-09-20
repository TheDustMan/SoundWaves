// ./my-project/app.js
console.log('Welcome to my application');

// require the local module
var squareNumbers = require('./util/square-numbers');

var input = [1,2,3,4];
console.log('Input is:', input);
console.log('Squared is:', squareNumbers(input));
