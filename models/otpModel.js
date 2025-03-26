const { Schema, model } = require('mongoose')

const otpSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: String,
    required: true,
  }
}, { timestamps: true })

module.exports = model('opts', otpSchema)