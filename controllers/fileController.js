const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const { formidable } = require('formidable')
const pLimit = require('p-limit')
const { promisify } = require('util')
const { pipeline } = require('stream')
const fse = require('fs-extra')
const pump = promisify(pipeline)

const {
    v4: uuidv4
} = require('uuid')
const moment = require('moment')

class fileController {

    main_path = ''
    constructor() {
        this.main_path = __dirname + '/../files'
    }

    get_files = async (dist, type, data_type, user_path) => {

        const items = await fsPromises.readdir(dist)

        let folderData = []

        let totalSize = 0;


        for (const item of items) {

            const itemPath = path.join(dist, item)

            const stats = await fsPromises.stat(itemPath)

            let distpath = itemPath.split(path.join(this.main_path, user_path))[1]

            if (stats.isFile()) {

                if (data_type === 'file') {


                    let file_type = item.split('.')
                    file_type = file_type[file_type.length - 1]


                    folderData.push({
                        id: uuidv4(),
                        name: item,
                        type: 'file',
                        path: distpath,
                        file_type,
                        modified: moment(stats.birthtime).format('LLL'),
                        size: Math.ceil(stats.size / 1024)
                    })
                }

                if (data_type === 'folder') {
                    totalSize = totalSize + Math.ceil(stats.size / 1024)
                }


            } else if (stats.isDirectory()) {

                if (type) {

                    const subFolder = await this.get_files(itemPath, type, data_type, user_path)
                    totalSize += subFolder.totalSize

                    folderData.push({
                        id: uuidv4(),
                        name: item,
                        type: 'folder',
                        path: distpath,
                        modified: moment(stats.birthtime).format('LLL'),
                        items: subFolder.folderData
                    })

                } else {
                    folderData.push({
                        id: uuidv4(),
                        name: item,
                        type: 'folder',
                        path: distpath,
                        modified: moment(stats.birthtime).format('LLL')
                    })
                }
            }
        }

        return {
            folderData,
            totalSize
        }
    }

    getSize = async (dist, type, data_type, user_path) => {

        const items = await fsPromises.readdir(dist)
        let totalSize = 0;

        for (const item of items) {
            const itemPath = path.join(dist, item)

            const stats = await fsPromises.stat(itemPath)

            if (stats.isFile) {
                totalSize = totalSize + Math.ceil(stats.size / 1024)
            } else if (stats.isDirectory()) {
                let total = await this.getSize(itemPath, type, data_type, user_path)
                totalSize = totalSize + total
            }
        }
        return totalSize
    }

    fileLists = async (req, res) => {

        const {
            user_path
        } = req.userInfo
        const dist = this.main_path + '/' + user_path

        try {
            const {
                folderData,
                totalSize
            } = await this.get_files(dist, "lists", "folder", user_path)
            // console.log(folderData)
            return res.status(200).json({
                folderData,
                storageSize: totalSize
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    fileList = async (req, res) => {


        let {
            file_path
        } = req.query

        file_path = file_path ? file_path : ''

        const {
            user_path
        } = req.userInfo

        const dist = this.main_path + '/' + user_path + file_path

        try {
            const {
                folderData
            } = await this.get_files(dist, "", "file", user_path)

            const totalSize = await this.getSize(this.main_path + "/" + user_path, 'lists', 'folder', user_path)

            return res.status(200).json({
                folderData,
                storageSize: totalSize
            })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    createFolder = async (req, res) => {

        let { file_path, folder_name } = req.body
        console.log(req.body)
        file_path = file_path ? file_path : ""
        let tempName = folder_name
        folder_name = "/" + folder_name

        const {
            user_path
        } = req.userInfo

        const dist = this.main_path + '/' + user_path + file_path + folder_name

        const distTemp = this.main_path + '/' + user_path + file_path
        console.log(dist)
        try {
            const checkFolder = fs.existsSync(dist)
            if (checkFolder) {
                return res.status(400).json({ message: tempName + ` folder already exit.` })
            } else {
                await fsPromises.mkdir(dist)
                const newData = await this.get_files(distTemp, "", 'file', user_path)
                const allData = await this.get_files(this.main_path + '/' + user_path, 'lists', 'folder', user_path)

                return res.status(200).json({
                    message: 'success',
                    newData: newData.folderData,
                    allData: allData.folderData

                })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    copyFileStream = async (source, dist) => {
        await pump(fs.createReadStream(source), fs.createWriteStream(dist))
    }

    fileUpload = async (req, res) => {

        const form = formidable({ maxFiles: 10240 * 1020 * 1024 })

        const {
            user_path
        } = req.userInfo

        try {

            const [fields, files] = await form.parse(req)


            const distPath = fields.distPath[0]


            const limit = pLimit(parseInt(process.env.limit))

            await Promise.all(files.filesData.map(item =>

                limit(async () => {

                    const dist = this.main_path + '/' + user_path + distPath + "/" + item.originalFilename
                    if (!fs.existsSync(dist)) {
                        await this.copyFileStream(item.filepath, dist)
                    }

                    await fs.promises.unlink(item.filepath)

                })
            ))

            return res.status(200).json({ message: "success" })



        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    moveData = async (req, res) => {
        const { items, filePath, type } = req.body

        const {
            user_path
        } = req.userInfo

        if (type === 'copy') {

            const limit = pLimit(parseInt(process.env.limit))

            try {
                await Promise.all(items.map(item =>

                    limit(async () => {

                        const srcDir = this.main_path + "/" + user_path + item.path
                        const disDir = this.main_path + "/" + user_path + filePath + "/" + item.name

                        if (!fs.existsSync(disDir)) {
                            await fse.copy(srcDir, disDir)
                        }

                    })
                ))
            } catch (error) {

                console.log(error.message)
            }
        } else {
            try {
                const limit = pLimit(parseInt(process.env.limit))
                await Promise.all(items.map(item =>

                    limit(async () => {

                        const srcDir = this.main_path + "/" + user_path + item.path
                        const disDir = this.main_path + "/" + user_path + filePath + "/" + item.path

                        if (!fs.existsSync(disDir)) {
                            await fse.move(srcDir, disDir)
                        }

                    })
                ))
            } catch (error) {

                console.log(error.message)
            }
        }


        const dist = this.main_path + "/" + user_path + filePath

        try {
            const { folderData } = await this.get_files(dist, "", "file", user_path)
            return res.status(200).json({ message: "success", folderData })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    deleteData = async (req, res) => {

        const { items, filePath } = req.body


        const {
            user_path
        } = req.userInfo

        try {
            const limit = pLimit(parseInt(process.env.limit))

            await Promise.all(items.map(item =>

                limit(async () => {

                    const dist = this.main_path + "/" + user_path + item.path

                    if (item.type === 'folder') {
                        try {
                            await fsPromises.rm(dist, { recursive: true, force: true })
                            console.log('folder deleted successfull!')
                        } catch (error) {
                            console.log(`folder delete error ${error.message}`)
                        }
                    } else {
                        try {
                            await fsPromises.unlink(dist)
                            console.log('file deleted successfull!')
                        } catch (error) {
                            console.log(`file delete error ${error.message}`)
                        }
                    }

                })
            ))

            const dist = this.main_path + "/" + user_path + filePath

            try {
                const { folderData } = await this.get_files(dist, "", "file", user_path)
                const totalSize = await this.getSize(this.main_path + "/" + user_path, 'lists', 'folder', user_path)
                return res.status(200).json({
                    message: "success",
                    folderData,
                    storageSize: totalSize
                })
            } catch (error) {
                console.log(`files get error ${error.message}`)
                return res.status(200).json({ message: "success", folderData: [] })
            }

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    renameItem = async (req, res) => {

        let { newName, oldName, filePath } = req.body

        const {
            user_path
        } = req.userInfo

        filePath = filePath ? filePath : ""
        let name = newName;
        oldName = "/" + oldName
        newName = "/" + newName

        const dist = this.main_path + "/" + user_path + filePath



        try {
            const checkItemName = fs.existsSync(dist + newName)
            if (checkItemName) {

                return res.status(400).json({
                    message: name + ' already exit!'
                })
            } else {
                await fsPromises.rename(dist + oldName, dist + newName)

                try {
                    const { folderData } = await this.get_files(dist, "", "file", user_path)
                    return res.status(200).json({ message: "success", folderData })
                } catch (error) {
                    console.log(`files get error ${error.message}`)
                    return res.status(200).json({ message: "success", folderData: [] })
                }

            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }
}

module.exports = new fileController()