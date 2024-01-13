// Axios http request helper functions

import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://famous-crab-frock.cyclic.cloud';
console.log('BASE_URL: ', BASE_URL)

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});