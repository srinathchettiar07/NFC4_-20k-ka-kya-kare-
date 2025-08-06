// lib/ipfs.js
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
dotenv.config();

const INFURA_URL = `${process.env.INFURA_API_URL}/api/v0/add`;

export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);

  const response = await axios.post(INFURA_URL, formData, {
    headers: {
      ...formData.getHeaders(),
    },
    auth: {
      username: process.env.INFURA_PROJECT_ID,
      password: process.env.INFURA_PROJECT_SECRET,
    },
  });

  return response.data; // { Name, Hash, Size }
};
