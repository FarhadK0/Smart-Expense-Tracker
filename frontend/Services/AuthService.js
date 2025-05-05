import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // 

//Register User
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);

    return response.data;
  }
  catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    }
    catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    }
    catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  };

  //Logout User
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
   
  };

  //Get Current User
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };

  //Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') ? true : false;
  };
  const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    isAuthenticated
  };

  export default AuthService;