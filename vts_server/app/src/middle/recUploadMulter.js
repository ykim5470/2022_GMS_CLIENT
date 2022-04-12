const multer = require('multer')
const util = require('util')
const path = require('path')
const thumbnailUploadDir = path.join(
  __dirname,
  '../uploads/GUIDE/streaming/rec/thumbnailSource',
)

const mediaUploadDir = path.join(
    __dirname, 
    '../uploads/GUIDE/streaming/rec/mediaSource',
)

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file)
    if(file.fieldname === 'thumbnail'){
        callback(null, thumbnailUploadDir)
    }
    if(file.fieldname === 'media'){
        callback(null, mediaUploadDir)
    }
    // callback(null, uploadDir)
  },
  filename: (req, file, callback) => {
    if(file.fieldname === 'thumbnail'){
        callback(
            null,
            'thumbnail_' + Date.now() + '.' + file.mimetype.split('/')[1],
          )
    }
    if(file.filename === 'media'){
        callback(
            null,
            'media_' + Date.now() + '.' + file.mimetype.split('/')[1],
          )
    }

  },
})

var uploadFiles =  multer({ storage: storage }).array('multiFiles',2)
var uploadFilesMiddleWare = util.promisify(uploadFiles)


module.exports = uploadFilesMiddleWare
