const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/signup', authController.signup)
router.post('/otp/verify', authController.otp_verify)

module.exports = router