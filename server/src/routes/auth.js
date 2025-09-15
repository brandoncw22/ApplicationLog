const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
//TODO: Implement Nodemailer so that we can send confirmation email

//POST Register Route
router.post('/register', async (req, res) => {
  try {
    const { username , email,  password } = req.body //Take in request params
    const hashedPassword = await bcrypt.hash(password, 10); //Hash Password
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, hashedPassword], function(err) {
      if (err) {
        console.error(err.message);
        res.json({error: err.message});
      } else {
        console.log("Registration successful!")
      }
    })
  } catch (error) {
    res.status(500).send('Error with registering user')
  }
});

//GET Login Route
router.get('/login', async (req, res) => {
  
})

//PUT Reset Password

//DELETE Delete Account