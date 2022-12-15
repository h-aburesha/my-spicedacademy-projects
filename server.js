const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const { engine } = require("express-handlebars");
const encrypt = require("./encrypt");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
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
    // SET FORM  USER: {} & IN THE HTML NAME IS FIRSTNAME & SET {{VALUE="PREDEFINED"}}
    res.render("register", {
        layout: "main",
        helpers: {
            formStyles: "registerStyles.css",
            favicon: "favicon.ico",
            //User: {firstname: "", lastname:""} then in the hbfile {{#users & then addess its variables inside the loo}}
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
            req.session.user_id = rows[0].id;
            res.redirect("/profile");
        })
        .catch((err) => console.log("error in addUserData: ", err));
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        helpers: {
            formStyles: "profileStyles.css",
            favicon: "favicon.ico",
        },
    });
});

app.post("/profile", (req, res) => {
    const user_id = req.session.user_id;
    const { age, city, homepage } = req.body;

    db.addProfiles(age, city, homepage, user_id).then(() =>
        res.redirect("/signers")
    );
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        helpers: {
            formStyles: "loginStyles.css",
            favicon: "favicon.ico",
        },
    });
    //
});

app.post("/login", (req, res) => {
    const { loginEmail, loginPassword } = req.body;

    db.getEmailandPassword(loginEmail).then(({ rows }) => {
        if (rows[0]) {
            console.log("getbyEmail:", rows[0]);
            encrypt
                .compare(loginPassword, rows[0].password)
                .then((passedTest) => {
                    if (passedTest) {
                        res.redirect("/thanks");
                        // console.log(
                        //     "passTest & Signed?",
                        //     passedTest,
                        //     req.session.signed
                        // );
                        // if(signed)
                        // res.redirect("/thanks");
                    } else {
                        res.redirect("/login");
                    }
                });
        } else {
            res.redirect("/register");
        }
    });

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
    //user_id & signed true or false is accessed globally from the set cookies
    const user_id = req.session.user_id;
    const { signature } = req.body;

    db.addSignature(signature, user_id)
        .then(() => {
            req.session.signed = true;
            console.log("Booleab Signed?: ", req.session.signed);
            res.redirect("/thanks");
        })
        .catch((err) => console.log("err in addSignature: ", err));
});

app.get("/signers", (req, res) => {
    // should also render the user with his signature (maybe also print certificate?)
    db.getUserDataAll().then(({ rows }) => {
        res.render("signers", {
            layout: "main",
            signers: rows,
            helpers: {
                formStyles: "signersStyles.css",
                favicon: "favicon.ico",
            },
        });
    });
});

app.get("/thanks", (req, res) => {
    if ((req.session.signed = true)) {
        res.render("thanks", {
            layout: "main",
        });
    } else {
        res.redirect("/petition");
    }
});

app.listen(process.env.PORT || 3000, console.log(".🧨.🧨.🧨.🧨"));
