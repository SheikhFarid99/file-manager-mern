const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
    select: false
  },
  user_path: {
    type: String,
    required: true,
  }
}, { timestamps: true })

module.exports = model('users', userSchema)