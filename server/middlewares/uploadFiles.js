const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage
({
    destination: function (req, file, cb) 
    {
        cb(null, `uploads/${file.fieldname}/`);
    },
    filename: function (req, file, cb) 
    {
        // Append the document type prefix to the filename
        const userEmail = req.user ? req.user.email : 'unknown';

        // Construct the filename
        const newFilename = `${userEmail}-${Date.now()}${path.extname(file.originalname)}`;

        cb(null, newFilename);
    },
});

const upload = multer({ storage: storage });

module.exports = { upload };
