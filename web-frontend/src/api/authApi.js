import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Thay port theo server của bạn

export const loginAdmin = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
