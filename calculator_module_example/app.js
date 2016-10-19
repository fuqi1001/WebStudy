const calculator = require("./calculator");
console.log(calculator.description);

let addTenAndTwelve = calculator.addTwoNumbers(10,12);
console.log(`the result is ${addTenAndTwelve}`);

let division = calculator.divideTwoNumbers(420, 12);
console.log(`the result is ${division}`);

let subtract = calculator.subtractTwoNumbers(18,12);
console.log(`the result is ${subtract}`);

let multiply = calculator.multiplyTwoNumbers(5, 20);
console.log(`the result is ${multiply}`);

