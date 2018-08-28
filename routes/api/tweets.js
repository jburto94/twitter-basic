const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      passport = require('passport');

const Tweet = require('../../models/Tweet'),
      Profile = require('../../models/Profile');

const validateTweetInput = require('../../validation/tweet');

// @route GET /api/tweets/test
// @desc Test tweets route
// @access Public
router.get('/test', (req, res) => {
  res.json({ message: 'Tweet routes work' });
});

// @route GET api/tweets
// @desc Get tweets
// @access Public
router.get('/', (req, res) => {
  Tweet.find()
    .sort({ date: -1 })
    .then(tweets => res.json(tweets))
    .catch(e => res.status(404).json({ notweetsfound: 'No tweets found' }));
});

// @route GET api/tweets/:id
// @desc Get tweet by tweet's id
// @access Public
router.get('/:id', (req, res) => {
  Tweet.findById(req.params.id)
    .then(tweets => res.json(tweets))
    .catch(e => res.status(404).json({ notweetsfound: 'No tweets found' }));
});

// @route POST api/tweets
// @desc Create tweet
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateTweetInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const newTweet = new Tweet({
    text: req.body.text,
    user: req.user.id
  });

  newTweet.save()
    .then(tweet => res.json(tweet));
});

// @route DELETE api/tweets/:id
// @desc Delete tweet
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          // Check for tweet owner
          if(tweet.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }

          // Delete
          tweet.remove()
            .then(() => {
              res.json({ success: true });
            })
            .catch(e => res.status(404).json({ tweetnotfound: 'Tweet not found' }));
        });
    });
});

// @route POST api/tweets/like/:id
// @desc Like the tweet
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          // Check if user has liked tweet already
          if(tweet.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this tweet' });
          }

          tweet.likes.unshift({ user: req.user.id });

          // Add liked tweet to profile liked tweets
          profile.liked.unshift(tweet);

          profile.save()
            .then(() => {
              tweet.save()
                .then(tweet => res.json(tweet));
            })
        })
        .catch(e => res.status(404).json({ tweetnotfound: 'Tweet not found' }));
    });
});

// @route POST api/tweets/unlike/:id
// @desc Unlike the post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          if(tweet.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this tweet' });
          }

          // Remove from tweet's likes
          // Get removal index
          const removalIndex = tweet.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of the array
          tweet.likes.splice(removalIndex, 1);

          // Remove from profile's liked
          // Get removal index
          const likedIndex = profile.liked
            .map(item => item._id.toString())
            .indexOf(tweet._id);
          
          profile.liked.splice(likedIndex, 1);

          profile.save()
            .then(() => {
              tweet.save()
                .then(tweet => res.json(tweet));
            });
          
        })
        .catch(e => res.status(404).json( { tweetnotfound: 'Tweet not found' }));
    });
});

// @route POST api/tweets/retweet/:id
// @desc Retweet the tweet
// @access Private
router.post('/retweet/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          // Check if user has liked tweet already
          if(tweet.retweets.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyretweeted: 'User already retweeted this tweet' });
          }

          tweet.retweets.unshift({ user: req.user.id });

          tweet.save()
            .then(tweet => res.json(tweet))
        })
        .catch(e => res.status(404).json( { tweetnotfound: 'Tweet not found' }));
    });
});

// @route POST api/tweets/detweet/:id
// @desc Detweet the post
// @access Private
router.post('/detweet/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          // Check if user has already retweeted the tweet
          if(tweet.retweets.filter(retweet => retweet.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notretweetd: 'You have not yet retweeted this tweet' });
          }

          //Get removal index
          const removalIndex = tweet.retweets
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of the array
          tweet.retweets.splice(removalIndex, 1);

          tweet.save()
            .then(tweet => res.json(tweet));
        })
        .catch(e => res.status(404).json( { tweetnotfound: 'Tweet not found' }));
    });
});

module.exports = router;