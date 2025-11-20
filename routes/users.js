var express = require('express');
var router = express.Router();
const db = require('../config/db');


// admin login router
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required", success: false });
    }

    const existingUser = await db.executeQuery("SELECT * FROM admin_users WHERE email = ? AND password = ?",
      [email, password]);

    if (existingUser.length > 0) {
      res.status(200).json({ message: "login successfull", success: true, user: existingUser[0] });
    } else {
      return res.status(401).json({ message: "invalid credentials", success: false });
    }

  } catch (error) {
    res.status(500).json({ error: "internal server error", success: false });

  }
});
module.exports = router;
