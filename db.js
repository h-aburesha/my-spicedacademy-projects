require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env; // add a .env file next to the db.js file with your PostgreSQL credentials
const spicedPg = require("spiced-pg");
const db = spicedPg(
    `postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/petition`
);

module.exports.getSigImg = (dbSigID) => {
    return db.query(`SELECT signature FROM signatures WHERE id = $1;`, [
        dbSigID,
    ]);
};

module.exports.addSignature = (firstName, lastName, signature) => {
    return db.query(
        `INSERT INTO signatures (firstname, lastname, signature) 
      VALUES ($1, $2, $3) RETURNING id`,
        [firstName, lastName, signature]
    );
};

// create the following functions:
//  - getAllSignatures - use db.query to get all signatures from table signatures
//  - addSignature - use db.query to insert a signature to table signatures
// Don't forget to export the functions with module.exports

/*
// Get the data URL from the database
var dataUrl = "<your data URL here>";

// Convert the data URL to an image
var image = dataUrlToImage(dataUrl);

// Set the src attribute of the <img> tag to the src attribute of the image object
document.getElementById("my-image").src = image.src;
*/
