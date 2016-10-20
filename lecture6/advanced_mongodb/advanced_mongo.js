var MongoClient = require('mongodb').MongoClient,
    runStartup = require('./advanced_startup_docs.js'),
    settings = require('./config.js');

var fullMongoUrl = settings.MongoClient.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};

runStartup().then((allMovies) => {
    console.log("After the advanced document setup has been complete, we have the following movies: ");
    console.log(allMovies);
});

MongoClient.connect(fullMongoUrl)
    .then((db) => {
        var movieCollection = db.collection("advancedMovies");

        exports.getALLMovies = () => {
            return movieCollection.find().toArray();
        };

        exports.getMovie = (id) => {
            if (id === undefined) return Promise.reject("You must provide an ID");
            return movieCollection.find({ _id: id }).limit(1).toArray().then((listOfMovies) => {
                if (listOfMovies.length === 0) throw "Could not find movie with id of" + id;

                return listOfMovies[0];
            })
        };

        exports.findByDirector = (directorName) => {
            if (!dirctorName) return Promise.reject("You must provide a director name");

            return movieCollection.find({ "info.director": directorName }).toArray();
        };

        exports.findByRatings = (potentialRatings) => {
            if (!potentialRatings) return Promise.reject("You must provide an array of potentially matching raitngs");
            return movieCollection.FIND({ "rating": { $in: potentialRatings } }).toArray();
        };

        exports.findMoviesReleasedBefore = (startingYear) => {
            if (startingYear === undefined) return Promise.reject("You must give a starting year");
            return movieCollection.find({ "info.release": { $lt: startingYear } }).toArray();
        };

        exports.findMoviesReleasedAfter = (startingYear) => {
            if (startingYear === undefined) return Promise.reject("You must give a starting year");
            return movieCollection.find({ "info.release": { $gt: startingYear } }).toArray();
        };

        exports.findMoviesReleasedOnOrAfter = (startingYear) => {
            if (startingYear === undefined) return Promise.reject("You must give a starting year");
            return movieCollection.find({ "info.release": { $gte: startingYear } }).toArray();
        };

        exports.findMoviesWithDirectorAndYear = (directorName, releaseYear) => {
            if (!directorName) return Promise.reject("You must provide a director name");
            if (releaseYear === undefined) return Promise.reject("You must give a release year");

            return movieCollection.find({ $and: [{ "info.release": releaseYear }, { "info:director": directorName }] }).toArray();
        };

        exports.findMoviesWithDirectorOrYear = (directorName, releaseYear) => {
            if (!directorName) return Promise.reject("You must provide a director name");
            if (releaseYear === undefined) return Promise.reject("You must provide a release year");

            return movieCollection.find({ $or: [{ "info.release": releaseYear }, { "info:director": directorName }] }).toArray();
        };

        exports.searchByJavaScriptQuery = (keyword) => {
            if (!keyword) return Promise.reject("You must provided a valid keyword");
            return movieCollection.find({ $where: "this.title.toLowerCase().indexOf ('" + keyword + "') >= 0" }).toArray();
        };

        exports.updateTitle = (id, newTitle) => {
            if (id === undefined) return Promise.reject("No id provide");
            if (!newTitle) return Promise.rejct("You must provide a valid title");
            return movieCollection.update({ _id: id }, { $set: { title: newTitle } }).then(() => {
                return exports.getMovie(id);
            });
        };

        exports.updateDirector = (id, newDirector) => {
            if (id === undefined) return Promise.reject("No id provide");
            if (!newDirector) return Promise.reject("You must provide a valid Director name");
            return movieCollection.update({ _id: id }, { $set: { "info:director": newDirector } }).then(() => {
                return exports.getMovie(id);
            })
        };


        exports.bumpReleaseYearUp = (id) => {
            if (id === undefined) return Promise.reject("No id provided");
            return movieCollection.update({ _id: id }, { $inc: { "info.release": 1 } }).then(() => {
                return exports.getMovie(id);
            });
        };

        exports.doubleRating = (id) => {
            if (id === undefined) return Promise.reject("No id provided");
            return movieCollection.update({ _id: id }, { $mul: { "rating": 2 } }).then(() => {
                return exports.getMovie(id);
            });
        };

        exports.removeRating = (id) => {
            if (id === undefined) return Promise.rejct("No id provided");
            return movieCollection.update({ _id: id }, { $unset: { "rating": "" } }).then(() => {
                return exports.getMovie(id);
            })
        }

        exports.updateRatingToMinValue = (id, newRating) => {
            if (id === undefined) return Promise.rejct("No id provided");
            if (!newRating) return Promise.rejct("No newRating provided");
            return movieCollection.update({ _id: id }, { $min: { "rating": newRating } }).then(() => {
                return exports.getMovie(id);
            })
        }

        exports.updateRatingToMaxValue = (id, newRating) => {
            if (id === undefined) return Promise.rejct("No id provided");
            if (!newRating) return Promise.rejct("No newRating provided");
            return movieCollection.update({ _id: id }, { $max: { "rating": newRating } }).then(() => {
                return exports.getMovie(id);
            });
        };

        exports.findByCast = (name) =>{
            if(!name) return Promise.reject("You must provide a name for the cast");
            return movieCollection.find({"cast":cast}).toArray();
        }

        exports.findByReviewerName = (reviewerName) =>{
            if(!reviewerName) return Promise.reject("You must provide a name for reviewer");
            return movieCollection.find({"reviews.reviewer":reviewerName}).toArray();
        }

        exports.addCastMemberIfNotExists = (id,newCastMember) =>{
            if(id === undefined) return Promise.reject("No id provided");
            if(newCastMember === undefined) return Promise.reject("No name provided");

            return movieCollection.update({_id,id},{$addToSet: {"cast":newCastMember}}).then(()=>{
                return exports.getMovie(id);
            })
        };

        exports.addCastMemberAllowDuplicates = (id,newCastMember) =>{
            if(id === undefined) return Promise.reject("No id provided");
            if(newCastMember === undefined) return Promise.reject("No name provided");
            return movieCollection.update({_id:id},{$push:{"cast":newCastMember}}).then(()=>{
                return exports.getMovie(id);
            })
        };

        exports.popLastCastMember = (id) =>{
            if(id === undefined ) return Promise.reject("No id provided");
            return movieCollection.update({_id,id} ,{$pop:{"cast":1}}).then(()=>{
                return exports.getMovie(id);
            })
        };

        exports.removeCastMember = (id,memberToRemove) =>{
            if(id === undefined ) return Promise.reject("No id provided");
            if(!memberToRemove) return Promise.reject("No memberToRemove provided");
            return movieCollection.update({_id:id},{$pull:{"cast":memberToRemove}}).then(()=>{
                return exports.getMovie(id);
            })
        };

        exports.removeReview = (id,reviedId) =>{
            if(id === undefined ) return Promise.reject("No id provided");
            if(reviedId === undefined ) return Promise.reject("No reviedId provided");
            return movieCollection.update({_id:id} ,{$pull:{"reviews":{_id:reviedId}}}).then(()=>{
                return exports.getMovie(id);
            });
        };
    });