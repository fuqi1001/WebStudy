const mongoCollections = require("./mongoCollections");
const dogs = mongoCollections.dogs;

let exportedMethods = {
    
    getDogById(id){
        return dogs().then((dogCollection) =>{
                return dogCollection.findOne({_id: id});
            });
    },

    addDog(name,breeds){
        return dogs().then((dogCollection) =>{
                let newDog = {
                    name: name,
                    breeds: breeds
                };

                return dogCollection.insertOne(newDog).then((newInsertInformation) =>{
                        return newInsertInformation.insertedId;
                    }).then((newId) =>{
                            return this.getDogById(newId);
                        });
            });
    },

    removeDog(id){
        return dogs().then((dogCollection) =>{
            return dogCollection.removeOne({_id:id}).then((deleteionInfo) =>{
                if(deleteionInfo.deletedCount === 0){
                    throw (`could not delete dog with id of ${id}`)
                }
            });
        });
    },

    updateDog(id, name, breeds){
        return dogs().then((dogCollection) => {
                let updateDog = {
                    name: name,
                    breeds: breeds
                };

                return dogCollection.updateOne({_id : id} ,updateDog).then(() =>{
                        return this.getDogById(id);
                    });
            });
    }
}
module.exports = exportedMethods;