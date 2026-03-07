import axios from 'axios';

const API = axios.create({ baseURL: 'https://voting-system-backend-b9y7.onrender.com' });

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');

// Voters
export const getVoters = () => API.get('/voters');
export const addVoter = (data) => API.post('/voters', data);
export const deleteVoter = (id) => API.delete(`/voters/${id}`);
export const verifyFingerprint = (data) => API.post('/voters/verify-fingerprint', data);

// Candidates
export const getCandidates = () => API.get('/candidates');
export const addCandidate = (data) => API.post('/candidates', data);
export const deleteCandidate = (id) => API.delete(`/candidates/${id}`);
export const getResults = () => API.get('/candidates/results');

// Voting
export const castVote = (data) => API.post('/voting/cast', data);
export const capturePhoto = (data) => API.post('/voting/capture-photo', data);
export const getVotingStatus = () => API.get('/voting/status');
export const setVotingTime = (data) => API.post('/voting/settings', data);
export const getVotingSettings = () => API.get('/voting/settings');
export const getVoteLogs = () => API.get('/voting/logs');
export const getVotingReceipt = () => API.get('/voting/receipt');

// OTP
export const sendOtp = () => API.post('/otp/send');
export const verifyOtp = (data) => API.post('/otp/verify', data);

export default API;
