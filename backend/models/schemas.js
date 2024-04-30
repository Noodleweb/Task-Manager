const mongoose = require('mongoose')
const Schema = mongoose.Schema


const usernameValidator = {
    validator: function(value) {
      // Add your regex pattern for username validation
      return /^[a-zA-Z0-9_-]+$/.test(value);
    },
    message: 'Username can only contain letters, numbers, underscores, and hyphens.'
  };

const userSchema = new Schema({
      username: {
        type: String,
        required: true,
        validate: usernameValidator
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      },
      password: {
        type: String,
        required: true
      }
})

const Users = mongoose.model('Users', userSchema,'users')
module.exports = {'Users':Users}