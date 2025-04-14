// src/axios.js
import axios from 'axios';

// Crear una instancia de axios con la URL base de tu backend
const instance = axios.create({
  baseURL: 'http://localhost:8080', // Your backend URL
});

// Agregar un interceptor para agregar el token de autorización a cada solicitud
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;