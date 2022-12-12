const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// console.log(teachers);

// Handlebars Setup
const { engine } = require("express-handlebars");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// End of setup

const urlEncodedMiddleware = express.urlencoded({ extended: false });
app.use(urlEncodedMiddleware);

app.use(express.static("./src"));
app.use(express.static("./views"));
app.use(express.static("../public"));

app.get("/petition", (req, res) => {
    res.render("petition", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        helpers: {
            drawCanvasScript: "canvasDraw.js",
            formStyles: "formStyles.css",
        },
    });
});

app.post("/petition", (req, res) => {
    // return new Promise ((resolve, reject)=> {

    // captureCanvas().then((signature) => {
    console.log(
        "POST Request Body",
        req.body.firstName,
        req.body.lastName,
        req.body.signature
    );
    res.redirect("/thanks");
    // });

    // })

    // Save first name, last name, and signature to Postgres SQL table
});

app.get("/signers", (req, res) => {
    res.render("signers", {
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
    res.render("thanks", {
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
