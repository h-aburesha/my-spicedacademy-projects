require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env; // add a .env file next to the db.js file with your PostgreSQL credentials
const spicedPg = require("spiced-pg");
const db = spicedPg(
    `postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/petition`
);

module.exports.getSigImg = (user_id) => {
    return db.query(`SELECT signature FROM signatures WHERE id = $1;`, [
        user_id,
    ]);
};

// module.exports.getEmailandPassword = (loginEmail) => {
//     return db.query(`SELECT email, password, id FROM users WHERE email = $1 `, [
//         loginEmail,
//     ]);
// };

module.exports.getEmailandPassword = (loginEmail) => {
    return db.query(
        `SELECT email, password, signature FROM users FULL OUTER JOIN signatures ON users.id = signatures.user_id WHERE email = $1 `,
        [loginEmail]
    );
};

module.exports.getUserDataAll = () => {
    return db.query(
        `SELECT users.firstname, users.lastname, user_profiles.city, user_profiles.age, user_profiles.homepage, 
        * FROM users
        FULL OUTER JOIN user_profiles ON users.id = user_profiles.user_id;`
    );
};

/* ---------------------------------
INSERT INTO users (name, age, oscars)
VALUES
ON CONFLICT (name or user_id)
DO UPDATE bla bla
---------------------------------- */

module.exports.addUserData = (firstName, lastName, email, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) 
      VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName, lastName, email, password]
    );
};

module.exports.addProfiles = (city, age, homepage, user_id) => {
    return db.query(
        `INSERT INTO user_profiles (city, age, homepage, user_id) 
      VALUES ($1, $2, $3, $4)`,
        [city, age, homepage, user_id]
    );
};

module.exports.addSignature = (signature, user_id) => {
    return db.query(
        `INSERT INTO signatures (signature, user_id) 
      VALUES ($1, $2)`,
        [signature, user_id]
    );
};
