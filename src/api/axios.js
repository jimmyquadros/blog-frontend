import axios from 'axios';

const BASE_URL = 'https://famous-crab-frock.cyclic.cloud'; //'http://localhost:5000';

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});