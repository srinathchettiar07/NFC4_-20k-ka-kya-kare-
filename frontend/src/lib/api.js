// src/lib/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getAllDocuments = async () => {
  const response = await API.get('/documents'); // Backend must implement this
  return response.data;
};
