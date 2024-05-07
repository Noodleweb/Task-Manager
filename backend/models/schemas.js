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
const subTaskSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const taskSchema = new Schema({
  title:{type:String, required:true},
  description:{type:String, required:false},
  dueDate:{type:Date, required:false},
  subTasks: [subTaskSchema],
  user: { type: Schema.Types.ObjectId, ref: 'User' } 
});

taskSchema.index({ user: 1 });

const Tasks = mongoose.model('Task', taskSchema,'tasks');
const Users = mongoose.model('Users', userSchema,'users');
module.exports = {'Users':Users,'Task':Tasks}