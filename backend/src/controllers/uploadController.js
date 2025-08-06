// controller/uploadController.js
import { uploadToIPFS } from '../lib/ipfs.js';
import Document from '../models/Document.js';

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const ipfsResult = await uploadToIPFS(file);

    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsResult.Hash}`;

    const doc = new Document({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      ipfsHash: ipfsResult.Hash,
      ipfsUrl,
    });

    await doc.save();

    res.status(200).json({
      success: true,
      message: 'File uploaded to IPFS successfully.',
      data: {
        name: file.originalname,
        hash: ipfsResult.Hash,
        url: ipfsUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
