const jsonFile = require("./jsonFileMod");

console.log("start of code");

let numVowelsInNames = 0;
let names = [];
let vowels = ["a","e","i","o","u"];

let readTeamFile = (file,callback) => {
    jsonFile.readJSON(file,callback);
}

jsonFile.readJSON("the-c-team.json", (error,asObject) => {
    if (error) throw error;

    asObject.forEach((person) =>{
        names.push(person.name.toLowerCase());
    })

    let nameData = {};

    names.forEach((name) => {
        let currentName = name;
        let currentNameVowels = 0;

        name.split("").forEach((c) => {
            if(vowels.indexOf(c) >= 0){
                //console.log(c);
                numVowelsInNames++;
                currentNameVowels++;
            }
        });
        nameData[currentName] = currentNameVowels;
    });
    console.log(nameData);

    jsonFile.writeJSON("name-data.json",nameData, (error,data) =>{
        if(error) throw error;
        jsonFile.readJSON("name-data.json", (error,data) =>{
            console.log(data);
        });
    });
    console.log(`we have ${numVowelsInNames} vowels in their names`);

});

console.log("end of code");



