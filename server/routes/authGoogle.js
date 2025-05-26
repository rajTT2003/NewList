// routes/authGoogle.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // ✅ Added this line
const router = express.Router();

// Load environment variables
require('dotenv').config(); // ✅ Optional if already done in your server entry point

// Step 1: Kick off Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects here after approval
// routes/authGoogle.js
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // Expire in 1 day
    );

    console.log('Redirecting with token:', token);

    // Redirect with token in URL for frontend to store in localStorage
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

module.exports = router;
