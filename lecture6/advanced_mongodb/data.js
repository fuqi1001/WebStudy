var MongoClient = require('mongodb').MongoClient,
    runStartup = require("./startup.js"),
    settings = require('./config.js'),
    Guid = require('Guid');

var fullMongoUrl = settings.mongoConfig.serverUrl + setting.mongoConfig.database;
var exports = module.exports = {}

runStartup().then((allMovies) => {
    console.log("After the setup has been complete, we have the following movies: ");
    console.log(allMovies);
});

MongoClient.connect(fullMongoUrl)
    .then((db) => {
        var movieCollection = db.collection("movies");
        exports.getAllMovies = function () {
            return movieCollection.find().toArray();
        };

        exports.getMovie = () => {
            if (!id) return Promise.reject("You must provide an ID");
            return movieCollection.find({ _id: id }).limit(1).toArray().then((listMovies) => {
                if (listMovies.length === 0) throw "Could not find movie with id of " + id;
                return listOfMovies[0];
            })
        }

        exports.createMovie = (title, rating) => {
            if (!title) return Pormise.reject("You must provide a title");
            if (rating == null || rating === undefined || rating < 0 || rating > 5) return Pormise.reject("You have provide a invalid rating");
            return movieCollection.insertOne({ _id: Guid.create().toString(), title: title, rating: rating })
                .then((newDoc) => {
                    return newDoc.insertedId;
                }).then((newId) => {
                    return exports.getMovie(newId);
                })
        }


        exports.getPopularMovies = () => {
            return movieCollection.find({ rating: { $gte: 3 } }).toArray();
        };

        exports.updateMovie = (id, newTitle, newRating) => {
            if (!id) return Promise.reject("You must provide an ID");
            if (!newTitle) return Promise.reject("You must provide a Title");
            if (newRating == null || newRating === undefined || newRating < 0 || newRating > 5)
                return Promise.reject("You must provide a vaild rating");

            return movieCollection.updateOne({ _id: id }, { title: newTitle, rating: newRating })
                .then(() => {
                    return exports.getMovie(id);
                })
        };

        exports.deleteMovie = (id) => {
            if (!id) return Promise.reject("You must provide an ID");

            return movieCollection.deleteOne({ _id: id })
                .then((deleteInfo) => {
                    if (deleteInfo.deletedCount === 0) throw "Could not find the document with this id to delete"

                    return true;
                });
        }


    });