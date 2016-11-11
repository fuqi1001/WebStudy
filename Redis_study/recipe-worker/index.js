//const recipeData = require("../recipe-data/index");
const fetch = require('node-fetch');
const cache = require('express-redis-cache')({ prefix: false });
var redis = require("redis"),
    client = redis.createClient();


const NRP = require('node-redis-pubsub');
const config = {
    port: 6379, // Port of your locally running Redis server
    scope: 'recipes' // Use a scope to prevent two NRPs from sharing messages
};

const redisConnection = new NRP(config); // This is the NRP client

// Note, this is really bad.
const pixabayApiKey = "3432196-710f5c9e1d0f75f6c0aa4a34a";
const basePixabayUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&safesearch=true&q=`;

redisConnection.on('create-recipe:*', (data, channel) => {
    /*let messageId = data.requestId;

    let fullyComposeRecipe = recipeData
        .addRecipe(data.recipe)
        .then((newRecipe) => {
            return fetch(`${basePixabayUrl}${newRecipe.title}`).then((res) => {
                return res.json();
            }).then((response) => {
                return response
                    .hits
                    .map(x => x.previewURL)
                    .slice(0, 5);
            }).then((hits) => {
                return recipeData
                    .addImagesToRecipe(newRecipe._id, hits)
                    .then((recipeWithUrls) => {
                        return recipeData
                            .findRecipesWithIngredients(recipeWithUrls.ingredients.map(x => x.systemTitle))
                            .then(recipeList => {

                                let recipeListExceptCurrent = recipeList.filter(x => x._id !== newRecipe._id);

                                console.log(recipeListExceptCurrent);
                                // Perform logic here Go through entire recipe list Calculate the percentage
                                // matched for each. Compose an array of data calls to setup the percentage
                                // matched Add all, then resolve to recipeWithUrls
                                return recipeWithUrls;
                            });
                    })
            }).then((recipeWithUrls) => {
                redisConnection.emit(`recipe-created:${messageId}`, recipeWithUrls);
            }).catch(error => {
                console.log(error);
                // we will submit errors back to the frontend
            });
        });*/

    //==================================================================

    client.hmset('recipes', data.requestId, JSON.stringify(data.recipe));
    let flag = client.hmget('recipes', data.requestId, (err, val) => {
        redisConnection.emit(`recipe-created:${data.requestId}`, data);
    });
    if (flag == false) {
        redisConnection.emit(`recipe-create-failed:${data.requestId}`, 'fail to create new recipe');
    }


});

redisConnection.on('create-user:*', (data, channel) => {
    let userId = data.userID;
    console.log(userId);

    client.keys('???[^\:][^\:]*', (err, obj) => {
        console.log(obj);
        if (obj.length == 0) {
            client.sadd(userId, JSON.stringify({ userId: userId, username: data.username, password: data.password }));
            redisConnection.emit(`user-created:${userId}`, 'success');
        }
        else {
            client.sunion(obj, (err, rt) => {
                let keep;
                if (rt) {
                    let result;
                    let flag = true;
                    rt.forEach((item) => {
                        //console.log(item);
                        item = JSON.parse(item);
                        if (data.username == item.username) {
                            flag = false;
                        }
                    })
                    if (flag == true) {
                        console.log("success");
                        client.sadd(userId, JSON.stringify({ userId: userId, username: data.username, password: data.password }));
                        redisConnection.emit(`user-created:${userId}`, 'success');
                    } else {
                        console.log("fail")
                        redisConnection.emit(`user-created-failed:${userId}`, 'Same user name with existed user, create fail');
                    }
                }
            })
        }

    })

})



redisConnection.on('put-user:*', (data, channel) => {
    let userId = data.userID;
    console.log(userId);

    client.keys('???[^\:][^\:]*', (err, obj) => {
        console.log(obj);
        if (obj.length == 0) {
            client.sadd(userId, JSON.stringify({ userId: userId, username: data.username, password: data.password }));
            redisConnection.emit(`user-put:${userId}`, 'success');
        }
        else {
            client.sunion(obj, (err, rt) => {
                let keep;
                if (rt) {
                    let result;
                    let flag = true;
                    rt.forEach((item) => {
                        //console.log(item);
                        item = JSON.parse(item);
                        if (data.username == item.username) {
                            flag = false;
                        }
                    })
                    if (flag == true) {
                        console.log("success");

                        let keep = data.username;

                        cache.get(keep, (error, entries) => {
                            if (error) throw error;
                            //console.log(entries[0].body);
                            if (entries.length == 0) { return; }
                            let cur = JSON.parse(entries[0].body)
                            let temp = {
                                username: cur.username,
                                userId: cur.userId
                            }
                            cache.add(temp.username, JSON.stringify(temp), { expire: 300, tyoe: 'json' }, (error, added) => { })
                            console.log(temp);
                            //res.send(temp);
                        })

                        client.sadd(userId, JSON.stringify({ userId: userId, username: data.username, password: data.password }));
                        redisConnection.emit(`user-put:${userId}`, 'success');
                    } else {
                        console.log("fail")
                        redisConnection.emit(`user-put-failed:${userId}`, 'Same user name with existed user, create fail');
                    }
                }
            })
        }
    })
})


redisConnection.on('update-recipe:*', (data, channel) => {
    console.log(data);
    client.hmset('recipes', data.requestId, JSON.stringify(data.recipe));


    let flag = client.hmget('recipes', data.requestId, (err, val) => {
        redisConnection.emit(`recipe-updated:${data.requestId}`, data);
    });
    if (flag == false) {
        redisConnection.emit(`recipe-updated-failed:${data.requestId}`, 'fail to create new recipe');
    }
})

redisConnection.on('delete-recipe:*', (data, channel) => {
    console.log(data);

    let flag = client.hdel('recipes', data.requestId, (err, deleted) => {
        let target = "erc:" + data.requestId;
        client.del(target);
        redisConnection.emit(`recipe-deleted:${data.requestId}`, 'Recipe deleted');
    });

    console.log(flag);

    if (flag == false) {
        redisConnection.emit(`recipe-delete-failed:${data.requestId}`, 'fail to delete recipe');
    }
    /*client.keys(target,(err,val)=>{
        console.log(val);
    });*/
})