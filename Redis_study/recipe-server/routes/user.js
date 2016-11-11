const express = require('express');
const router = express.Router();
const uuid = require("node-uuid")
const passport = require('passport');
const cache = require('express-redis-cache')({ prefix: false });
var redis = require("redis"),
    client = redis.createClient();
var session = require('express-session');


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

router.delete("/", passport.authenticate('header', { session: false }), (req, res) => {
    client.keys('???[^\:][^\:]*', (err, obj) => {
        client.sunion(obj, (err, rt) => {
            if (rt) {
                rt.forEach((item) => {
                    item = JSON.parse(item);
                    if (req.body.username == item.username) {
                        client.del(item.userId);
                    }
                })
            }
        })
    })
    console.log(req.session.cUser.username);
    cache.del(req.body.username, (err, added) => { });
    req.session.destroy();
    res.send("delete success");
})

router.put("/", passport.authenticate('header', { session: false }), (req, res) => {
    //console.log(req.session.cUser.userId);
    let redisConnection = req.app.get("redis");

    client.keys('???[^\:][^\:]*', (err, obj) => {
        client.sunion(obj, (err, rt) => {
            let keep;
            if (rt) {
                let result;
                rt.forEach((item) => {
                    //console.log(item);
                    item = JSON.parse(item);
                    if (req.body.userId == item.userId) {

                        keep = item.username;
                        client.srem(item.userId, JSON.stringify(item), (error, added) => { });
                        item.password = req.body.newPassword;

                        redisConnection.emit(`put-user:${item.userId}`, {
                            userID: item.userId,
                            username: item.username,
                            password: item.password
                        });

                        let userId = item.userId;
                        let killswitchTimeoutId = undefined;

                        redisConnection.on(`user-put:${userId}`, (insertedUser, channel) => {
                            
                            res.json(insertedUser);
                            redisConnection.off(`user-put:${userId}`);
                            redisConnection.off(`user-put-failed:${userId}`);
                            clearTimeout(killswitchTimeoutId);
                        });

                        redisConnection.on(`user-put-failed:${userId}`, (error, channel) => {
                            res.status(500).json(error);
                            redisConnection.off(`user-put:${userId}`);
                            redisConnection.off(`user-put-failed:${userId}`);
                            clearTimeout(killswitchTimeoutId);
                        });

                        killswitchTimeoutId = setTimeout(() => {
                            redisConnection.off(`user-put:${userId}`);
                            redisConnection.off(`user-put-failed:${userId}`);
                            res.status(500).json({ error: "Timeout error" })
                        }, 5000);
                    }
                })
            }
        })
    })
})


router.get("/test", (req, res) => {
    //console.log(req);
    res.send("q");

})

router.post("/", (req, res) => {

    let newUser = req.body;

    let redisConnection = req.app.get("redis");

    let userId = uuid.v4();
    let killswitchTimeoutId = undefined;

    redisConnection.on(`user-created:${userId}`, (insertedUser, channel) => {
        res.json(insertedUser);
        redisConnection.off(`user-created:${userId}`);
        redisConnection.off(`user-created-failed:${userId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-created-failed:${userId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`user-created:${userId}`);
        redisConnection.off(`user-created-failed:${userId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-created:${userId}`);
        redisConnection.off(`user-created-failed:${userId}`);
        res.status(500).json({ error: "Timeout error" })
    }, 5000);

    redisConnection.emit(`create-user:${userId}`, {
        userID: userId,
        username: newUser.username,
        password: newUser.password
    });
});

router.get("/", (req, res) => {
    client.keys('???[^\:][^\:]*', (err, obj) => {
        //console.log(obj);
        client.sunion(obj, (err, rt) => {
            //console.log(rt);
            let output = '';
            //rt = JSON.parse(rt);
            // console.log(rt);
            if (rt) {
                let save = {};
                save.body = [];
                rt.forEach((val) => {
                    save.body.push(JSON.parse(val));
                })
                //console.log(save.body);
                cache.add('user', JSON.stringify(save), { expire: 600, type: 'json' }, (error, added) => { });
            }
            cache.get('user', (error, entries) => {
                //if (error) throw error;
                if(entries.length == 0){
                    res.status(404).json("user no found");
                    return;
                }
                let temp = JSON.parse(entries[0].body);
                console.log(temp);
                let result = [];
                temp.body.forEach((val) => {
                    let obj = {
                        username: val.username,
                        userId: val.userId
                    }

                    result.push(obj);
                })
                res.json(result);
            })
        });
    });
})
router.get("/:id", (req, res) => {
    client.keys('???[^\:][^\:]*', (err, obj) => {
        client.sunion(obj, (err, rt) => {
            let keep;
            if (rt) {
                let result;
                rt.forEach((item) => {
                    item = JSON.parse(item);

                    if (req.params.id == item.userId) {
                        //console.log("*: " + item);
                        keep = item.username;
                        cache.add(item.username, JSON.stringify(item), { expire: 300, type: 'json' }, (error, added) => { })
                    }
                })
            }
            cache.get(keep, (error, entries) => {
                if (error) throw error;
                //console.log(entries[0].body);
                if(entries.length == 0){
                    res.status(404).json("user no found");
                    return;
                }
                let cur = JSON.parse(entries[0].body)
                let temp = {
                    username: cur.username,
                    userId: cur.userId
                }
                //console.log(temp);
                res.send(temp);
            })
        })
    })
})
router.post("/session", (req, res) => {
    let t = req.get('Auth-token');
    console.log(t);
    let cUser = req.session.cUser;
    let view = req.session.view;

    client.keys('???[^\:][^\:]*', (err, obj) => {
        client.sunion(obj, (err, rt) => {
            if (rt) {
                let flag = false;
                rt.forEach((item) => {
                    item = JSON.parse(item);
                    if (req.body.username == item.username && req.body.password == item.password) {
                        flag = true;
                    }
                })
                if (flag == true) {
                    if (!cUser) {
                        cUser = {
                            id: req.body.userId,
                            username: req.body.username,
                            token: t
                        }
                        cUser.recipes = [];
                        req.session.cUser = cUser;
                        console.log(cUser);
                        res.json(cUser);
                    } else {
                        res.json("Please delete the exist session before create new session");
                    }

                } else {
                    req.session.destroy();
                    res.json("wrong user name or password");
                }
            }
        })
    })

})

module.exports = router;
