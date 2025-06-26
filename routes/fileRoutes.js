const router = require('express').Router()
const fileController = require('../controllers/fileController')
const authMiddleware = require('../middleware/middleware')

router.get('/lists', authMiddleware, fileController.fileLists)

router.get('/list', authMiddleware, fileController.fileList)


module.exports = router