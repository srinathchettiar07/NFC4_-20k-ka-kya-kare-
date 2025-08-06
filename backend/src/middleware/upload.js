// middleware/upload.js
import multer from 'multer';
import path from 'path';

// Allowed extensions
const FILE_TYPES = /jpeg|jpg|png|pdf|docx/;

const storage = multer.memoryStorage(); // Store in memory for direct IPFS upload

const fileFilter = (req, file, cb) => {
  const extname = FILE_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = FILE_TYPES.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only images (jpeg, png), PDFs, and DOCX files are allowed.'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});
