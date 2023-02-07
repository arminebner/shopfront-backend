import path from 'path'
import multer from 'multer'

const dirname = path.join(__dirname, '..', 'public', 'images')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirname)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
  },
})

const upload = multer({ storage: storage })

export default upload
