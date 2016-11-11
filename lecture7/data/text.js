let exportedMethods = {
    insertString(str1, str2, time, num){
        if(str1 == null || str1 == "") throw "Please provide a valid input string";
        if(str2 == null || str2 == "") throw "Please provide a valid input string";
        
        if(typeof time != "number" || isNaN(time)) throw "Please provide a valid input number for insert time"
        if(time < 1 || time > 25) throw "Invalid times, range 1~25"

        if(typeof num != "number" || isNaN(num)) throw "Please provide a valid input number for interval"
        if(time < 1 || time > 25) throw "Invalid times, range 1~25"

        if(str1.length < time * num) throw "Invalid times and interval for this string";

        let start = 0;
        let output = "";
        while(start <= str1.length && time > 0){
            if(start == str1.length){
                output += str2;
                time--;
            }else{
                output += str1.substring(start, start + num) + str2;
                start += num;
                time--;
            }
        }

        if(start < str1.length){
            output += str1.substring(start);
        }
        return output;
    }
}

module.exports = exportedMethods;