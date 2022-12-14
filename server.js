const express = require("express");
const app = express();

const path = require("path");

const db = require("./db");
const cookieSession = require("cookie-session");

// Handlebars Setup
const { engine } = require("express-handlebars");
const encrypt = require("./encrypt");

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
        layout: "main",
        helpers: {
            formStyles: "registerStyles.css",
            favicon: "favicon.ico",
        },
    });
});

app.post("/register", (req, res) => {
    // console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    encrypt
        .hash(password)
        .then((hashedPWD) => {
            return db.addUserData(firstName, lastName, email, hashedPWD);
        })
        .then(({ rows }) => {
            const signatureRowId = rows[0].id;
            req.session.signerID = signatureRowId;
            console.log("req.session.signerID", req.session.signerID);
            res.redirect("/profile");
        })
        .catch((err) => console.log("error in addUserData: ", err));
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        helpers: {
            formStyles: "profileStyles.css",
            favicon: "favicon.ico",
        },
    });
    //
});

app.post("/profile", (req, res) => {
    const { age, city, homepage } = req.body;
    db.addProfiles(age, city, homepage);
});

app.get("/login", (req, res) => {
    res.render("login", {
        //whatever you specify here,
        // it will be used as a body in the main.handlebars!
        // (i.e. home.handlebars)
        layout: "main",
        // projects: projectsList,
        // showImage: true,
        helpers: {
            formStyles: "loginStyles.css",
            favicon: "favicon.ico",
        },
    });
    //
});

app.post("/login", (req, res) => {
    // First check by the email if the user exists in your Database
    // If he/she exists then compare if the password matches
    // Go to the Signatures Table to see if this user already signed
    // If the user has signed already redirect to Thanks Page
    // Otherwise redirect to Signature Page
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

    const { signature, user_id } = req.body;

    db.addSignature(signature, user_id)
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

app.listen(process.env.PORT || 3000, console.log("running at 3000"));
