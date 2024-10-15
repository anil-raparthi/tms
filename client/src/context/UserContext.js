// src/context/UserContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const login = (userToken) => {
        setToken(userToken);
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setToken("");
        localStorage.removeItem('token');
    };

    const signUp = async (username, password) => {
      try {
          const response = await axios.post('http://localhost:5000/signup', {
              username,
              password,
          });
          return response.data;
      } catch (error) {
          throw new Error('Signup failed');
      }
    };

    return (
        <UserContext.Provider value={{ token, login, logout, signUp }}>
            {children}
        </UserContext.Provider>
    );
};
