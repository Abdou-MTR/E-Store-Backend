// middleware.js

const multer = require("multer");

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

// Create upload middleware with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
