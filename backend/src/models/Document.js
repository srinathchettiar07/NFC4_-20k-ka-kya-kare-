// model/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  ipfsHash: String,
  ipfsUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Document', documentSchema);
