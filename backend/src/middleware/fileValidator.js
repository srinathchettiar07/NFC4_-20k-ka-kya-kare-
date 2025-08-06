// middleware/fileValidator.js
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  next();
};
