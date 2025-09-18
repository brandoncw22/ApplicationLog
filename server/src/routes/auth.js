const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const auth = require('../middleware/auth');
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
  try {
    const { username,  password } = req.body //Take in request params
    const query = `SELECT * FROM users WHERE username = ?`;
    db.run (query, [username], async (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        console.log('Problem with login credentials')
        return res.status(401).send('Invalid login credentials');
      }

      //Check if password matches
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log('Invalid Credentials: Wrong Password');
        return res.status(401).send('Invalid login credentials');
      }
      //Generate Session Token
      const token = auth.generateToken(username);
      res.json({ token });
    }) 
  } catch (error) {
    res.status(500).send('Error with login');
  }
})

//PUT Reset Password

//DELETE Delete Account

module.exports = router;