console.log("Start");

let itemSet = () =>{
    let itemCount = 1;

    let items = [
        {id: itemCount++, item: "Sword of Truth"},
        {id: itemCount++, item: "Book of Wisdom"},
        {id: itemCount++, item: "Potion of Healing"},
    ];

    return {
        addItem: (item) => {
            return new Promise((fulfill,reject)=>{
                if(!item) reject("You did not provide an item");

                fulfill(items.push({id: itemCount++, item:item }));
                console.log(item);
            });
        },

        getItem: () => {
            return new Promise((fulfill,reject) =>{
                setTimeout(() => {
                    if(items.length > 0) fulfill(items.shift());

                    reject("No items left !");
                },750);
            });
        }
    }
}

let firstItemSet = itemSet();
/*
firstItemSet.getItem()
    .then((firstItem) =>{
        console.log("You got a new item!");
        console.log(firstItem);
        return firstItemSet.getItem();
        //throw "No, this is bad";
    })
    .then((secondItem) => {
        console.log("you got a second item!");
        console.log(secondItem);
        return firstItemSet.getItem();
    })
    .then((lastItemReceied) =>{
        console.log("the last item received was:");
        console.log(lastItemReceied);
    })
    .catch((error) => {
        console.error("an error occurred");
        console.error(error);
        return "we've survived the error";
    })
    .then((message) => {
        console.log("There is no 4th");
    });
*/

let firstChain = firstItemSet.getItem().then((firstItem) => {
    console.log("You got a new item! ");
    console.log(firstItem);

    return firstItemSet.getItem().then((secondItem) => {
        console.log("You got a new item");
        console.log(secondItem);
        
        return firstItemSet.getItem().then((thirdItem) => {
            console.log("You got a new item");
            console.log(thirdItem);

            return firstItemSet.getItem().then((forthItem) =>{
                return [firstItem,secondItem,thirdItem,forthItem];
            }).catch(() => {
                console.log("There was no forth item!");
                return [firstItem,secondItem,thirdItem];
            });
        });
    });
}).then((items) => {
    console.log("all the item were: ");
    console.log(items);
    return items;
},(error) => {
    console.log("There was an error: ");
    console.log(error);

    return [];
});

let secondItemSet = itemSet();

let secondChain = firstChain.then(() => {
    console.log("\n\n\nStarting second chain");

    return secondItemSet.getItem().then((firstItem) => {
        return [firstItem];
    });
}).then((itemsSoFar) => {
    return secondItemSet.getItem().then((secondItem) => {
        return itemsSoFar.concat([secondItem]);
    });
}).then((itemsSoFar) => {
    return secondItemSet.getItem().then((thirdItem) =>{
        return itemsSoFar.concat([thirdItem]);
    });
}).then((items) => {
    console.log("all the items in chain 2 were :");
    console.log(items);

    return items;
});