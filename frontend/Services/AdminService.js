import axios from "axios";


const ADMIN_API_URL = "http://localhost:5000/api/admin";

// Admin login
const login = async (adminData) => {
  try {
    const res = await axios.post(`${ADMIN_API_URL}/login`, adminData);

    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
    }

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed. Please try again." };
  }
};

const register = async (adminData) => {
  try {
    const res = await axios.post(`${ADMIN_API_URL}/signup`, adminData);
    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
    }
    return res.data;
  }
  catch (error) {
    throw error.response?. data || { message: "Registration failed. Please try again."};
  }
};

// Admin logout
const logout = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
};

// Check if admin is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};

const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/forgot-password`, { email });
    return response.data;
  }
  catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

const AdminService = {
  register,
  login,
  logout,
  isAuthenticated,
  forgotPassword,
};

export default AdminService;
