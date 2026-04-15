const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: 'Please enter username',
    unique: true // Ensure username is unique
  },
  password: {
    type: String,
    required: 'Please enter password'
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'user'], // Only allow these values
    default: 'user'
  }
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);