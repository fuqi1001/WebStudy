(function () {
    let textMethods = {
        insertString(str1, str2, time, num) {
            if (str1 == null || str1 == "") throw "Please provide a valid input string";
            if (str2 == null || str2 == "") throw "Please provide a valid input string";

            if (typeof time != "number" || isNaN(time)) throw "Please provide a valid input number for insert time"
            if (time < 1 || time > 25) throw "Invalid times, range 1~25"

            if (typeof num != "number" || isNaN(num)) throw "Please provide a valid input number for interval"
            if (time < 1 || time > 25) throw "Invalid times, range 1~25"

            if (str1.length < time * num) throw "Invalid times and interval for this string";

            let start = 0;
            let output = "";
            while (start <= str1.length && time > 0) {
                if (start == str1.length) {
                    output += str2;
                    time--;
                } else {
                    output += str1.substring(start, start + num) + str2;
                    start += num;
                    time--;
                }
            }

            if (start < str1.length) {
                output += str1.substring(start);
            }
            return output;
        }
    };


    let clientForm = document.getElementById("client-form");
    if(clientForm){

        let string_oneElement = document.getElementById("string_one");
        let string_twoElement = document.getElementById("string_two");
        let timeElement = document.getElementById("time");
        let intervalElement = document.getElementById("interval");

        let errorContainer = document.getElementById("error-container");
        let errorInfo = document.getElementsByClassName("error-info")[0];

        let resultContainer = document.getElementById("result-container");
        let successInfo = document.getElementsByClassName("success-info")[0];


        clientForm.addEventListener("submit", (event)=>{
            event.preventDefault();
            
            try {
                errorContainer.classList.add("hidden");
                resultContainer.classList.add("hidden");

                let str1Value = string_oneElement.value;
                let str2Value = string_twoElement.value;
                let timeValue = parseInt(timeElement.value);
                let intervalVale = parseInt(intervalElement.value);
                let output = textMethods.insertString(str1Value,str2Value,timeValue,intervalVale);
                successInfo.textContent = output;
                resultContainer.classList.remove("hidden");

            } catch (error) {
                let message = typeof error === "string"? error : error.message;

                errorInfo.textContent = error;
                errorContainer.classList.remove("hidden");
            }
        });
    }
})();