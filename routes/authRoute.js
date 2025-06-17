const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)
router.post('/otp/verify', authController.otp_verify)

module.exports = router