const express = require("express");
const static = express.static(__dirname + '/public');

let app = express();
app.use("/public", static);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use("*", (req, res) =>{
    res.status(404).send('404 not found');
});

app.listen(3000, ()=>{
    console.log("Your routes will be running on http://localhost:3000");
})