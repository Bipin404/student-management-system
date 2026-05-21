const multer = require('multer');
const path = require('path');

// ─── STORAGE CONFIGURATION ────────────────────────────────
const storage = multer.diskStorage({
  // Where to save the file
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  // What to name the file
  // We use timestamp + original name to avoid duplicates
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s/g, '');
    cb(null, uniqueName);
  },
});

// ─── FILE FILTER ──────────────────────────────────────────
// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // Check the file extension
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check the file mimetype
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject
  }
};

// ─── MULTER INSTANCE ──────────────────────────────────────
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;