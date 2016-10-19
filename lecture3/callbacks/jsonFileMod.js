const fs = require('fs');

let jsonFileMode = exports = module.exports;

jsonFileMode.readJSON = (fileName,callback) =>{
    fs.readFile(fileName,"UTF-8", (error,data) => {
        callback(error,JSON.parse(data))
    });
};

jsonFileMode.writeJSON = (fileName,data,callback) =>{
    fs.writeFile(fileName,JSON.stringify(data,null,4),callback);
};

