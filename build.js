const fs = require('fs')
const path = require('path')
const sanitize = require('sanitize-filename')

const directory = './my-folder'

function renameFilesInDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`)
            return
        }

        files.forEach(file => {
            const oldFilePath = path.join(dirPath, file)
            const newFilePath = path.join(dirPath, sanitize(file))

            fs.stat(oldFilePath, (err, stats) => {
                if (err) {
                    console.error(`Error reading file stats: ${err}`)
                    return
                }

                if (stats.isDirectory()) {
                    renameFilesInDirectory(oldFilePath)
                } else {
                    if (oldFilePath !== newFilePath) {
                        fs.rename(oldFilePath, newFilePath, err => {
                            if (err) {
                                console.error(`Error renaming file: ${err}`)
                            } else {
                                console.log(`${oldFilePath} renamed to ${newFilePath}`)
                            }
                        })
                    }
                }
            })
        })
    })
}

renameFilesInDirectory('.')