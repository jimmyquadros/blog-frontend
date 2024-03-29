// Axios http request helper functions

import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:5000';

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});