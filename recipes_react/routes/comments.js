const express = require('express');
const router = express.Router();
const data = require("../data");
const commentData = data.comments;

router.get("/", (req, res) =>{
    commentData.getAllComments().then((commentList) =>{
        res.json(commentList);
    }).catch(() =>{
        res.sendStatus(500);
    });
});

router.post("/", (req, res) =>{
    let newComment = req.body.comment;

    commentData.addComment(newComment).then((comment) =>{
        res.json(comment);
    }).catch(() =>{
        res.sendStatus(500);
    })
});
module.exports = router;