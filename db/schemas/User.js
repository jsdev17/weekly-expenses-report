const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: null
  },
  itemId: {
    type: String,
    default: null
  }
},
{ 
  collection: 'Users',
  versionKey: false
});

const User = mongoose.model('User', UserSchema);

module.exports = User;