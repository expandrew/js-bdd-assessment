var splitter = function(rawInput) {

	var numberArray = rawInput.toString().split("").map(Number);
	var bigArray = [];
	var originalLength = numberArray.length;

	for (var i=0; i<originalLength; i+=3) {
		bigArray.push(numberArray.slice(-3));
		numberArray.splice(((numberArray.length)-3), 3);
	};

	return bigArray.reverse();

	//returns format [[1],[2,3,4],[5,6,7],[8,9,0]]
	//pass bigArray into numbersToWords();
}


var numbersToWords = function(rawInput) {

	var bigArray = splitter(rawInput);

	var finalArray = [];
	var powerNumber= 0;

	var onesWords = { 	0: "", 
											1: "one", 
											2: "two", 
											3: "three", 
											4: "four", 
											5: "five", 
											6: "six", 
											7: "seven", 
											8: "eight", 
											9: "nine" };
	
	var teensWords = { 	10: "ten", 
											11: "eleven", 
											12: "twelve", 
											13: "thirteen", 
											14: "fourteen", 
											15: "fifteen", 
											16: "sixteen", 
											17: "seventeen", 
											18: "eighteen", 
											19: "nineteen" };

	var tensWords = { 	2: "twenty", 
											3: "thirty", 
											4: "forty", 
											5: "fifty", 
											6: "sixty", 
											7: "seventy", 
											8: "eighty", 
											9: "ninety" };  
	
	var powerWords = {	1000: "thousand,",
											1000000: "million,",
											1000000000: "billion,",
											1000000000000: "trillion,"};

	for (var i=0; i<bigArray.length; i++) {

		var l = bigArray[i].length;
		powerNumber = 0;

		//special case: user inputs '0'
		if (bigArray.length === 1 && bigArray[i][0] === 0) {
			finalArray.push("zero");
			break;
		}

		//evaluate hundreds digit
		if (l === 3 && bigArray[i][0] !== 0) {
			finalArray.push(onesWords[bigArray[i][0]] + " " + "hundred");
		}

		//evaluate tens and ones digits
		//21 or greater
		if (bigArray[i][l-2] >= 2 && bigArray[i][l-1] !== 0) {
			finalArray.push(tensWords[bigArray[i][l-2]] + " " + onesWords[bigArray[i][l-1]]);
		}
		//20/30/40/.../90
		else if (bigArray[i][l-2] >= 2 && bigArray[i][l-1] === 0) {
			finalArray.push(tensWords[bigArray[i][l-2]]);
		}
		//11-19
		else if (bigArray[i][l-2] === 1) {
			var teenNumber = "1" + bigArray[i][l-1];
			var teenNumberInt = parseInt(teenNumber);
			finalArray.push(teensWords[teenNumberInt]);
		}
		//if the [l-2] index is a zero (i.e. '0' in 201)
		else if (bigArray[i][l-2] === 0) {
			//and if the [l-1] index is NOT a zero (i.e. '1' in 201)
			if (bigArray[i][l-1] !== 0) {
				finalArray.push(onesWords[bigArray[i][l-1]]);
			}
		//single digit in bigArray[i] (i.e. 1)
		} else if (l = 1 && bigArray[i][0] !== 0) {
			finalArray.push(onesWords[bigArray[i][l-1]]);
		}

		//for thousands/millions/billions/trillions
		powerNumber = Math.pow(10,((bigArray.length-i-1) * 3));
		if (powerNumber >= 1000 && (bigArray[i][0] !== 0 || bigArray[i][1] !== 0 || bigArray[i][2] !== 0)) {
			finalArray.push(powerWords[powerNumber]);
		}

	} //end of the for loop

	// check if there is a comma at the end of the line and if yes, remove it

	return finalArray.join(" ").replace(/[,]$/,'');


} //end function

$(document).ready (function() {

	$("form#input-form").submit (function(event) {

		event.preventDefault();
		var rawInput = $("input#rawInput").val();

		// INPUT VALIDATION

		var errorInstructions = "";
		
		// to keep track of validation result so we hide output if it fails
		var failedValidation = false;
		
		// for decimal validation
		var weRounded = false;
		$('#we-rounded').text("");


		rawInput = rawInput.replace(/[, ]+/g, ''); // remove commas

		if (rawInput.length > 15) {
				errorInstructions = "Please choose a smaller number.";
				$('#errorInstructions').text(errorInstructions);
				$('.alert-modal-sm').modal('show');
				failedValidation = true;
				$('.output-modal-lg').modal('hide');
				

		} else {
			
			if (rawInput.indexOf('.') !== -1) {
				var weRounded = true;
				rawInput = parseInt(rawInput); // remove decimals
			}

			if (isNaN(rawInput)) {
				errorInstructions = "Please enter a number.";
				$('#errorInstructions').text(errorInstructions);
				failedValidation = true;
				$('.alert-modal-sm').modal('show');

				
			} else if (rawInput <= 0) {
				errorInstructions = "Please enter a positive number.";
				$('#errorInstructions').text(errorInstructions);
				$('.alert-modal-sm').modal('show');
				failedValidation = true;
				$('.output-modal-lg').modal('hide');

			}
		}

		var outputString = numbersToWords(rawInput);
		if (failedValidation === false) {
			if (weRounded === true) {
				$('#we-rounded').text("We rounded your number down.");
			}
			$('.output-modal-lg').modal('show');
			$("#output").text(outputString);
		} else {
			$("input#rawInput").val("");
		}


	})
})