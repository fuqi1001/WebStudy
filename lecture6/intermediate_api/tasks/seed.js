const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const posts = data.posts;

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        //console.log(db);
        return dbConnection;
    }).then((db) => {
        return users.addUser("Phil", "Barresi");
    }).then((phil) => {
        const id = phil._id;
        //console.log(id);
        return posts
            .addPost("Hello, class!", "Today we are creating a blog!","123", id)
            .then(() => {
                return posts.addPost("Using the seed", "We use the seed to have some initial data so we can just focus on servers this week","123", id);
            })
            .then(() => {
                return posts.addPost("Using routes", "The purpose of today is to simply look at some GET routes","123", id);
            });
    }).then(() => {
        console.log("Done seeding database");
        db.close();
    });
}, (error) => {
    console.error(error);
});

