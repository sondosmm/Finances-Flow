const multer = require('multer');
const ApiError = require('../utils/apiError');

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) { cb(null, true); }
        else {
            cb(new ApiError('Only audio files are allowed', 400), false);
        }
    }
});
module.exports = upload;