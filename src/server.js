const express = require("express");
const app = express();

// console.log(teachers);

// Handlebars Setup
const { engine } = require("express-handlebars");
const projectsList = require("./projects.json");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// End of setup

app.use(express.static("./public"));
app.use(express.static("./src"));

app.get("/petition", (req, res) => {
    res.render("petition", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        // helpers: {
        //     getnewstyle: "/style.css",
        // },
    });
});

app.get("/signers", (req, res) => {
    res.render("petition", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        // helpers: {
        //     getnewstyle: "/style.css",
        // },
    });
});

app.get("/thanks", (req, res) => {
    res.render("petition", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        // helpers: {
        //     getnewstyle: "/style.css",
        // },
    });
});

app.listen(3000, console.log("running at 3000"));
