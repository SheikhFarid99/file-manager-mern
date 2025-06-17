var validator = require('validator');
const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const fs = require('fs')
const fsPromises = require('fs/promises')
const jwt = require('jsonwebtoken')
class authController {

    signup = async (req, res) => {

        let {
            name,
            email,
            password
        } = req.body

        if (validator.isEmpty(name)) {
            return res.status(404).json({
                message: "Name is Required"
            })
        }
        if (validator.isEmpty(email)) {
            return res.status(404).json({
                message: "Email is Required"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(404).json({
                message: "Please provide valid email"
            })
        }
        if (validator.isEmpty(password)) {
            return res.status(404).json({
                message: "Password is Required"
            })
        }
        if (password.length < 6) {
            return res.status(404).json({
                message: "Password more then 5 character"
            })
        }

        const otp = Math.floor(Math.random() * 1111 + 8888)

        email = email.trim()
        name = name.trim()


        try {
            const user = await userModel.findOne({
                email
            })
            if (user) {
                return res.status(400).json({
                    message: "Email already exit"
                })
            }
            const otpInfo = {
                email: email,
                password: await bcrypt.hash(password, 9),
                otp,
                name
            }

            const findOtpInfo = await otpModel.findOne({
                email
            })

            if (findOtpInfo) {
                await otpModel.findOneAndUpdate({
                    email
                }, {
                    data: JSON.stringify(otpInfo)
                })
            } else {
                await otpModel.create({
                    email,
                    data: JSON.stringify(otpInfo)
                })
            }

            let configOptions = {
                service: 'gmail',
                auth: {
                    user: process.env.user_email,
                    pass: process.env.user_password
                }
            }

            // const transporter = nodemailer.createTransport(configOptions)

            const mailOptions = {
                from: process.env.user_email,
                to: email,
                subject: 'Verification Code',
                html: `<div>
          <div>
            <p>Hi ${name}</p>
          </div>
          <div>
            <p>Welcome to File Manager , Your OTP Code <strong>${otp}</strong></p>
          </div>
        </div>`
            }

            console.log(otpInfo)

            try {
                //await transporter.sendMail(mailOptions)
            } catch (error) {
                console.log('Email send Failed ' + error.message)
            }
            console.log(otpInfo)
            return res.status(200).json({
                message: 'Please check your email and verify otp'
            })


        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    otp_verify = async (req, res) => {

        let {
            email,
            otp
        } = req.body

        if (validator.isEmpty(email)) {
            return res.status(404).json({
                message: "Email is Required"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(404).json({
                message: "Please provide valid email"
            })
        }
        email = email.trim()
        try {
            let otpInfo = await otpModel.findOne({
                email
            })

            if (otpInfo) {
                otpInfo = JSON.parse(otpInfo.data)
                if (parseInt(otp) === parseInt(otpInfo.otp)) {
                    await otpModel.findOneAndDelete({
                        email: otpInfo.email
                    })

                    let user_path = otpInfo.email.split('@')[0]
                    user_path = user_path.replace(/\./g, "") + Date.now()

                    const dist = __dirname + `/../files` + '/' + user_path

                    await fsPromises.mkdir(dist)

                    let user = await userModel.create({
                        email: otpInfo.email,
                        password: otpInfo.password,
                        name: otpInfo.name,
                        user_path
                    })


                    const token = await jwt.sign({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        user_path: user.user_path
                    }, process.env.secret, {
                        expiresIn: `${process.env.exp_token}d`
                    })

                    return res.status(200).json({
                        message: "Signup Successfull",
                        token
                    })

                } else {
                    return res.status(400).json({
                        message: "Wrong OTP"
                    })
                }
            } else {

                return res.status(400).json({
                    message: "Something is wrong , Please try again"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    signin = async (req, res) => {

        let {
            email,
            password
        } = req.body

        if (validator.isEmpty(email)) {
            return res.status(404).json({
                message: "Email is Required"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(404).json({
                message: "Please provide valid email"
            })
        }
        if (validator.isEmpty(password)) {
            return res.status(404).json({
                message: "Password is Required"
            })
        }
        email = email.trim()

        try {
            let user = await userModel.findOne({
                email
            }).select("+password")


            if (user) {

                const match_password = await bcrypt.compare(password, user.password)

                if (match_password) {

                    const token = await jwt.sign({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        user_path: user.user_path
                    }, process.env.secret, {
                        expiresIn: `${process.env.exp_token}d`
                    })

                    return res.status(200).json({
                        message: "Signin Successful",
                        token
                    });
                } else {
                    return res.status(400).json({
                        message: 'Wrong password'
                    })
                }
            } else {
                return res.status(404).json({
                    message: 'User not found!'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

module.exports = new authController()