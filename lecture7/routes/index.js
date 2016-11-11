const textRoutes = require("./text");


const constructorMethod = (app) => {
    app.use("/text", textRoutes);

    app.use("*", (req, res) => {
        res.redirect("/text/clientform");
    })
};

module.exports = constructorMethod;
