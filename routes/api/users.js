const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      User = require('../../models/User'),
      keys = require('../../config/keys'),
      passport = require('passport');

// Load input Validation
const validateRegisterInput = require('../../validation/register'),
      validateLoginInput = require('../../validation/login');

// @route GET /api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => {
  res.json({ message: 'Users works!' });
});

// @route GET /api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      }
    });

  User.findOne({ handle: req.body.handle })
    .then(user => {
      if(user) {
        errors.handle = 'Handle already exists';
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          handle: req.body.handle,
          password: req.body.password
        });

        // Salt the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(e => console.log(e));
          });
        });
      }
    });
});

// @route /api/users/login
// @desc Login user and get token
// @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email,
        password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then(user => {
      // Check for user
      if(!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            // Create JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              handle: user.handle
            }
            // Sign Token
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              { expiresIn: 172800 }, 
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token // Adds token for header
                });
              }
            );
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        });
    });
});

// @route GET /api/users/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;