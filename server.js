const express = require("express");
const app = express();

const path = require("path");

const db = require("./db");
const cookieSession = require("cookie-session");

// Handlebars Setup
const { engine } = require("express-handlebars");
const { decodeBase64 } = require("bcryptjs");
const { resolve } = require("path");
const { json } = require("express");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// End of setup

const urlEncodedMiddleware = express.urlencoded({ extended: false });
app.use(urlEncodedMiddleware);

app.use(express.static("./views"));
app.use(express.static("./public"));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.get("/register", (req, res) => {
    res.render("register", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        helpers: {
            formStyles: "registerStyles.css",
            favicon: "favicon.ico",
        },
    });
});

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
            favicon: "favicon.ico",
        },
    });
});

app.post("/petition", (req, res) => {
    // console.log(req.body);

    const { firstName, lastName, signature } = req.body;

    db.addSignature(firstName, lastName, signature)
        .then(({ rows }) => {
            const signatureRowId = rows[0].id;
            req.session.signerID = signatureRowId;
            res.redirect("/thanks");
        })
        .catch((err) => console.log("err in addSignature: ", err));
});

// })

// Save first name, last name, and signature to Postgres SQL table

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
    if (req.session.signerID) {
        const dbSigID = req.session.signerID;
        db.getSigImg(dbSigID).then(({ rows }) => {
            // console.log("rows:", rows);
            const sigDataURL = rows[0].signature;
            // console.log("sigDataURL:", sigDataURL);

            res.render("thanks", {
                //whatever you specify here,
                // it will be used as a body in the main.handlebars!
                // (i.e. home.handlebars)
                layout: "main",
                // projects: projectsList,
                // showImage: true,
                sigSrcURL: sigDataURL,
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.listen(3000, console.log("running at 3000"));
