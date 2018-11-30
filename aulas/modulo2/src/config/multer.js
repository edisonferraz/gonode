const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const slug = require('slug')

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(10, (err, raw) => {
        if (err) return cb(err)

        cb(
          null,
          slug(path.parse(file.originalname).name, { lower: true }) +
            '-' +
            raw.toString('hex') +
            path.extname(file.originalname)
        )
      })
    }
  })
}
