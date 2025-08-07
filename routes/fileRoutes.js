const router = require('express').Router()
const fileController = require('../controllers/fileController')
const authMiddleware = require('../middleware/middleware')

router.get('/lists', authMiddleware, fileController.fileLists)

router.get('/list', authMiddleware, fileController.fileList)

router.post('/create', authMiddleware, fileController.createFolder)
router.post('/files-upload', authMiddleware, fileController.fileUpload)
router.post('/move-data', authMiddleware, fileController.moveData)

router.post('/delete', authMiddleware, fileController.deleteData)
router.post('/rename', authMiddleware, fileController.renameItem)

module.exports = router