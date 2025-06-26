const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
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

    fileLists = async (req, res) => {

        const {
            user_path
        } = req.userInfo
        const dist = this.main_path + '/' + user_path

        try {
            const {
                folderData
            } = await this.get_files(dist, "", "", user_path)
            // console.log(folderData)
            return res.status(200).json({
                folderData
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

            return res.status(200).json({
                folderData
            })

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    }
}

module.exports = new fileController()