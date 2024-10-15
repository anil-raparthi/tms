// src/api/authApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';  // Flask backend URL

// Login API call
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;  // { access_token: "JWT_TOKEN" }
  } catch (error) {
    throw new Error('Invalid login credentials');
  }
};
