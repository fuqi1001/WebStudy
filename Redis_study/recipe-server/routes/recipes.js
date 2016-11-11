const express = require('express');
const router = express.Router();
//const recipeData = require("../../recipe-data/recipes");
//const userData = require("../../recipe-data/users");
//console.log(userData.getAllUsers());
const passport = require('passport');
const cache = require('express-redis-cache')({ prefix: false });
var redis = require("redis"),
    client = redis.createClient();
var session = require('express-session');
const uuid = require("node-uuid");
var headerStrategy = require('passport-http-header-strategy').Strategy;

router.use(passport.initialize());
passport.use(new headerStrategy({ header: 'Auth-Token', passReqToCallback: true },
    function (req, token, done) {
        //console.log(req.session);

        if (req.session.cUser != null && req.session.cUser.token == token) {
            console.log("au success");
            //if (req.session.cUser.username == req.body.username && req.session.cUser.password == req.body.password) {
            return done(null, req, { scope: 'all' });
            //}
        }
        return done(null, false);
    }
))



router.get("/", (req, res) => {
    /*recipeData
        .getAllRecipes()
        .then((recipeList) => {
            res.json(recipeList);
        })
        .catch(() => {
            // Something went wrong with the server!
            res.sendStatus(500);
        });*/
    let result = new Array();
    client.hkeys('recipes', (err, obj) => {
        obj.forEach((recipeID) => {
            client.hmget('recipes', recipeID, (err, val) => {
                val = JSON.parse(val);
                let body = {
                    id: recipeID,
                    title: val.title,
                    creator: val.creator,
                    creaotor_id: val.creator_id
                }
                result.push(body);
            })
        })

    })
    setTimeout(() => {
        let temp = JSON.stringify(result);
        cache.add('all_recipe', temp, { expire: 3600, type: 'json' }, (error, added) => {
            res.send(JSON.parse(temp));
        })

    }, 500);

});


router.get("/:id", passport.authenticate('header', { session: false }), (req, res) => {
    let result;
    client.hkeys('recipes', (err, obj) => {
        obj.forEach((recipeID) => {
            if (req.params.id == recipeID) {
                client.hmget('recipes', recipeID, (err, val) => {
                    val = JSON.parse(val);
                    result = val;
                    if (req.session.cUser.recipes.length == 10) {
                        req.session.cUser.recipes.shift();
                    }
                    req.session.cUser.recipes.push(val);
                    //res.send(val);
                })
            }
        })
    })
    setTimeout(() => {
        let temp = JSON.stringify(result);
        console.log(req.session.cUser.recipes.length);
        res.send(JSON.parse(temp));
    }, 500);

})

router.post("/", passport.authenticate('header', { session: false }), (req, res) => {
    let newRecipe = req.body;
    //console.log(newRecipe);
    // console.log(Object.keys(newRecipe).length);
    if (Object.keys(newRecipe).length === 0) {
        res.status(404).json("no info be provided");
        return;
    }

    newRecipe.creator = req.session.cUser.username;
    newRecipe.creator_id = req.session.cUser.id;

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;

    redisConnection.on(`recipe-created:${messageId}`, (insertedRecipe, channel) => {
        cache.add(messageId, JSON.stringify(insertedRecipe), { expire: 3600, type: 'json' }, (error, added) => {
            res.json(insertedRecipe);
            redisConnection.off(`recipe-created:${messageId}`);
            redisConnection.off(`recipe-create-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
        });
        /*cache.get('recipe',(error, entries)=>{
            console.log(entries);
        })*/

    });

    redisConnection.on(`recipe-create-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`recipe-created:${messageId}`);
        redisConnection.off(`recipe-create-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-created:${messageId}`);
        redisConnection.off(`recipe-creat-failed:${messageId}`);
        res.status(500).json({ error: "Timeout error" })
    }, 5000);


    redisConnection.emit(`create-recipe:${messageId}`, {
        requestId: messageId,
        recipe: newRecipe,
    });

});


router.put("/:id", passport.authenticate('header', { session: false }), (req, res) => {
    client.hkeys('recipes', (err, obj) => {
        console.log("run1");
        obj.forEach((recipeID) => {
            console.log("run2");
            if (req.params.id == recipeID) {
                console.log("run3");
                client.hmget('recipes', recipeID, (err, val) => {
                    val = JSON.parse(val);
                    console.log("run4");
                    console.log(val.creator_id + " " + req.session.cUser.id);
                    if (val.creator_id == req.session.cUser.id) {
                        console.log("yep");
                        let targetId = req.params.id;

                        let ReRecipe = req.body;
                        if (Object.keys(ReRecipe).length === 0) {
                            res.status(404).json("no info be provided");
                            return;
                        }

                        let redisConnection = req.app.get("redis");
                        let killswitchTimeoutId = undefined;


                        redisConnection.on(`recipe-updated:${targetId}`, (insertedRecipe, channel) => {
                            cache.add(req.params.id, JSON.stringify(insertedRecipe), { expire: 3600, type: 'json' }, (error, added) => {
                                console.log("cache updated");
                                res.json(insertedRecipe);
                                redisConnection.off(`recipe-updated:${targetId}`);
                                redisConnection.off(`recipe-updated-failed:${targetId}`);
                                clearTimeout(killswitchTimeoutId);
                            });
                            /*cache.get('recipe',(error, entries)=>{
                                console.log(entries);
                            })*/

                        });

                        redisConnection.on(`recipe-updated-failed:${targetId}`, (error, channel) => {
                            res.status(500).json(error);
                            redisConnection.off(`recipe-updated:${targetId}`);
                            redisConnection.off(`recipe-updated-failed:${targetId}`);
                            clearTimeout(killswitchTimeoutId);
                        });

                        killswitchTimeoutId = setTimeout(() => {
                            redisConnection.off(`recipe-updated:${targetId}`);
                            redisConnection.off(`recipe-updated-failed:${targetId}`);
                            res.status(500).json({ error: "Timeout error" })
                        }, 5000);

                        redisConnection.emit(`update-recipe:${targetId}`, {
                            requestId: targetId,
                            recipe: ReRecipe,
                        });

                    }
                })
            }
        })
    })
})



router.delete("/:id", passport.authenticate('header', { session: false }), (req, res) => {
    client.hkeys('recipes', (err, obj) => {
        let flag = false;
        obj.forEach((recipeID) => {
            if (req.params.id == recipeID) {
                client.hmget('recipes', recipeID, (err, val) => {
                    val = JSON.parse(val);
                    if (val.creator_id == req.session.cUser.id) {
                        flag = true;

                        let targetId = req.params.id;

                        let redisConnection = req.app.get("redis");
                        let killswitchTimeoutId = undefined;

                        redisConnection.on(`recipe-deleted:${targetId}`, (insertedRecipe, channel) => {
                            res.json(insertedRecipe);
                            redisConnection.off(`recipe-deleted:${targetId}`);
                            redisConnection.off(`recipe-delete-failed:${targetId}`);
                            clearTimeout(killswitchTimeoutId);
                            return;
                        });
                        redisConnection.on(`recipe-deleted-failed:${targetId}`, (error, channel) => {
                            res.status(500).json(error);
                            redisConnection.off(`recipe-deleted:${targetId}`);
                            redisConnection.off(`recipe-delete-failed:${targetId}`);
                            clearTimeout(killswitchTimeoutId);
                            return;
                        });
                        killswitchTimeoutId = setTimeout(() => {
                            redisConnection.off(`recipe-deleted:${targetId}`);
                            redisConnection.off(`recipe-delete-failed:${targetId}`);
                            res.status(500).json({ error: "Timeout error" })
                        }, 5000);

                        redisConnection.emit(`delete-recipe:${targetId}`, {
                            requestId: targetId,
                        });
                    }
                })
            }
        })
        setTimeout(() => {
            console.log(flag);
            if (!flag) {
                res.status(404).json("fail to delete recipe");
            }
        }, 500);

    })
})
module.exports = router;