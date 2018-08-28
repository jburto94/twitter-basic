const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ProfileSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  bio: {
    type: String
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  avatar: {
    type: String
  },
  // followers: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'User'
  //     }      
  //   }
  // ],
  // following: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'User'
  //     }      
  //   }
  // ],
  liked: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
      }
    }
  ]
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;