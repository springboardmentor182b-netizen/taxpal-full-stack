const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // always store as lowercase
    trim: true       // always trim whitespace
  },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

// This is a Mongoose model file, not a route file.
// Do not add Express routes here.
// All Express routes should be added in your routes/user.js file or similar.
