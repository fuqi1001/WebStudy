const recipeRoutes = require("./recipes");
const userRoutes = require("./user");


const constructorMethod = (app) => {
    app.use("/recipes", recipeRoutes);

    app.use("/user",userRoutes)
    
    app.get("/", (req, res) => {
        res.render("home", {});
    });
    
    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;