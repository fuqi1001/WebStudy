const express = require('express');
const router = express.Router();
const data = require("../data");
const text = data.text;

router.get("/serverform", (req, res) => {
    res.render("text/serverform", {});
});

router.get("/clientform", (req, res) => {
    res.render("text/clientform", {});
})

router.post("/serverform", (req, res) => {
    let str1 = req.body.string_one;
    let str2 = req.body.string_two;
    let time = parseInt(req.body.time);
    let interval = parseInt(req.body.interval);
    let output;
    try {
        output = text.insertString(str1, str2, time, interval);
    } catch (error) {
        res.render("text/serverform", {
            string_one: str1,
            string_two: str2,
            time: time,
            interval: interval,
            error: error
        })
        return;
    }
    res.render("text/serverform", {
        string_one: str1,
        string_two: str2,
        time: time,
        interval: interval,
        output: output
    })
});

module.exports = router;
