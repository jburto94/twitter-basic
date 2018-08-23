const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ProfileSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  avatar: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  birthdate: {
    type: Date
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;