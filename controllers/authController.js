var validator = require('validator');
const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const bcrypt = require('bcryptjs')
class authController {

  signup = async (req, res) => {

    let { name, email, password } = req.body

    if (validator.isEmpty(name)) {
      return res.status(404).json({ message: "Name is Required" })
    }
    if (validator.isEmpty(email)) {
      return res.status(404).json({ message: "Email is Required" })
    }
    if (!validator.isEmail(email)) {
      return res.status(404).json({ message: "Please provide valid email" })
    }
    if (validator.isEmpty(password)) {
      return res.status(404).json({ message: "Password is Required" })
    }
    if (password.length < 6) {
      return res.status(404).json({ message: "Password more then 5 character" })
    }

    const otp = Math.floor(Math.random() * 1111 + 8888)

    email = email.trim()
    name = name.trim()


    try {
      const user = await userModel.findOne({ email })
      if (user) {
        return res.status(400).json({ message: "Email already exit" })
      }
      const otpInfo = {
        email: email,
        password: await bcrypt.hash(password, 9),
        otp,
        name
      }

      const findOtpInfo = await otpModel.findOne({ email })

      if (findOtpInfo) {
        await otpModel.findOneAndUpdate({ email }, {
          data: JSON.stringify(otpInfo)
        })
      } else {
        await otpModel.create({
          email,
          data: JSON.stringify(otpInfo)
        })
      }

      console.log(otpInfo)

      return res.status(200).json({ message: 'Please check your email and verify otp' })


    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ message: "Internal server error" })
    }

  }
}

module.exports = new authController()