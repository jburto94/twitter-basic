const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const TweetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  retweets: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }      
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;