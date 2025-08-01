import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your Laravel backend URL
  withCredentials: true, // crucial for sending cookies
});

// For login and register, first get CSRF cookie
export async function getCsrfCookie() {
  await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
}

// Wrapper for login
export const login = async (email, password) => {
  await getCsrfCookie();
  return api.post('/login', { email, password });
};

// Wrapper for register
export const register = async (name, email, password, password_confirmation) => {
  await getCsrfCookie();
  return api.post('/register', { name, email, password, password_confirmation });
};

export default api;
