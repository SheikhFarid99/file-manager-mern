const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')

class fileController {

    main_path = ''
    constructor() {
        this.main_path = __dirname + '/../files'
    }

    get_files = async (dist, type, data_type, user_path) => {


        let folderData = []

        const items = await fsPromises.readdir(dist)

        for (const item of items) {

            const itemPath = path.join(dist, item)

            const stats = await fsPromises.stat(itemPath)

            let distpath = itemPath.split(path.join(this.main_path, user_path))[1]

            if (stats.isFile()) {

                // folderData.push({
                //     id: uuidv4(),
                //     name: item,
                //     type: 'file',
                //     path: distpath,
                //     modified: moment(stats.birthtime).format('LLL'),

                // })

            } else if (stats.isDirectory()) {

                const subFolder = await this.get_files(itemPath, "", "", user_path)

                folderData.push({
                    id: uuidv4(),
                    name: item,
                    type: 'folder',
                    path: distpath,
                    modified: moment(stats.birthtime).format('LLL'),
                    items: subFolder.folderData
                })
            }
        }

        return { folderData }
    }

    fileLists = async (req, res) => {

        const { user_path } = req.userInfo
        const dist = this.main_path + '/' + user_path

        try {
            const { folderData } = await this.get_files(dist, "", "", user_path)
            // console.log(folderData)
            return res.status(200).json({ folderData })
        } catch (error) {
            console.log(error.message)
             return res.status(500).json({ message : "Internal server error" })
        }
    }
}

module.exports = new fileController()