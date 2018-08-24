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
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;