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

module.exports.addUserData = (firstName, lastName, email, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) 
      VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName, lastName, email, password]
    );
};

module.exports.addProfiles = (city, age, homepage) => {
    return db.query(
        `INSERT INTO users (city, age, homepage) 
      VALUES ($1, $2, $3, $4)`,
        [city, age, homepage]
    );
};

module.exports.addSignature = (signature, user_id) => {
    return db.query(
        `INSERT INTO signatures (signature, user_id) 
      VALUES ($1, $2)`,
        [signature, user_id]
    );
};
