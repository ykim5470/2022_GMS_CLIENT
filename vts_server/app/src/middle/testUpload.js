const multer = require('multer')
const path = require('path')
const uploadDir = path.join(
  __dirname,
  '../uploads/',
)

console.log(uploadDir)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir)
  },
  filename: (req, file, callback) => {
    callback(
      null,
      'thumbnail_' + Date.now() + '.' + file.mimetype.split('/')[1],
    )
  },
})

module.exports = multer({ storage: storage })
<<<<<<< HEAD
=======

>>>>>>> a94ab28c583875491871a31f65e4212e1f2841cf
