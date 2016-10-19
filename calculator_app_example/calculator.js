module.exports = {

	description: "This is a calculator for CS546",
	
	divideTwoNumbers: function (numerator,denominator){
	if(numerator === undefined || typeof numerator !=="number"){
			throw "numerator is not a number";
	}
	if(denominator === undefined || typeof denominator !=="number"){
		throw "denominator is not a number";
	}

	if(denominator === 0 ){
		throw "denominator cannot be a zero";
	}

	return numerator / denominator;

	},

	addTwoNumbers: function (num1,num2) {
	if(num1 === undefined || typeof num1 !=="number"){
		throw "num1 is not a number";
	}
	if(num2 === undefined || typeof num2 !=="number"){
		throw "num2 is not a number";
	}

	return  num1 + num2;
	},

	multiplyTwoNumbers: function(num1,num2) {
	if(num1 === undefined || typeof num1 !=="number"){
		throw "num1 is not a number";
	}
	if(num2 === undefined || typeof num2 !=="number"){
		throw "num2 is not a number";
	}

	return  num1 * num2;
	},
	subtractTwoNumbers: function(num1,num2) {
	if(num1 === undefined || typeof num1 !=="number"){
		throw "num1 is not a number";
	}
	if(num2 === undefined || typeof num2 !=="number"){
		throw "num2 is not a number";
	}

	return  num1 - num2;
	},

};


