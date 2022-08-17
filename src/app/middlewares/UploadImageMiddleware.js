const multer = require('multer');
const path = require('path');
const slug = require('slug');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './src/public/assets/img/product')
        // console.log('====>' + '/public/assets/img/product')
    },
    filename: (req, file, callback) => {
        // const uniqueSuffix = new Date().toISOString().replace(/:/g, '-') + file.originalname
        // const uniqueSuffix = Date.now() + file.originalname;
        const uniqueSuffix = slug(req.body.name + req.body.author) + file.originalname;
        console.log(uniqueSuffix);
        callback(null, uniqueSuffix)
    }
});
// const upload = multer({storage: storage});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
  

module.exports = upload;
