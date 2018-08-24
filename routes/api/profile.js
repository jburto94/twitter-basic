const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');

// Load profile and user models
const Profile = require('../../models/Profile'),
      User = require('../../models/User');

// @route GET /api/profile/test
// @desc Test profile route
// @access Public
router.get('/test', (req, res) => res.json({ message: 'Profile works' }));

// @route GET /api/profile
// @desc Get current user profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'handle'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

// @route GET /api/profile/all
// @desc Get all profiles
// @access Public
router.get('/all', (req, res) => {
  const errors = {}; 

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(e => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route GET /api/profile/handle/:handle
// @desc Get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  User.findOne({ handle: req.params.handle })
    .then(user => {
      Profile.findOne({ user })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
  
        res.json(profile);
      })
    })
    .catch(e => res.status(404).json(e));
});

// @route GET /api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});
  

// @route POST /api/profile
// @desc Create or Edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  //Check Validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create
        new Profile(profileFields)
          .save()
          .then(profile => res.json(profile));
      }
    });
});

// @route DELETE /api/profile
// @desc Delete user and profile
// @access Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }));
    })
    .catch(e => res.status(400).json(e));
});

module.exports = router;