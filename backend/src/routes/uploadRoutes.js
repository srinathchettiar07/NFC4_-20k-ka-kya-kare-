// routes/uploadRoutes.js
import express from 'express';
import { upload } from '../middleware/upload.js';
import { validateFileUpload } from '../middleware/fileValidator.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), validateFileUpload, uploadFile);

export default router;
