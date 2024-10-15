import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const createTransaction = async (transaction) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/transactions`, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create transaction');
  }
};

export const getTransactions = async (filters) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/transactions`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch transactions');
  }
};

