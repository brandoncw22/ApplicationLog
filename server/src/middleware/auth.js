import dotenv from "dotenv";
const jwt = require('jsonwebtoken');

dotenv.config();
const key = process.env.secret_key;

function generateToken(username) {
    return jwt.sign({ username }, key, {expiresIn: '7d'});
}

module.exports = generateToken;