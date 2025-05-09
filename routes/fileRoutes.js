const router = require('express').Router()
const fileController = require('../controllers/fileController')
const authMiddleware = require('../middleware/middleware')

router.get('/lists', authMiddleware, fileController.fileLists)

module.exports = router