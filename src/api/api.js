import { auth } from '../firebase/firebase.config.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

//Helper function to get firebase token
const getFirebaseToken = async () => {
    const user = auth.currentUser;
    if(!user) {
        throw new Error('User not authenticated');
    }
    return await user.getIdToken();
};

//Helper function for API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
    const token = await getFirebaseToken();

    const headers = {
        'Content-Type': 'application/json',
    };

    if(token){
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if(body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || 'API call failed');
    }
    return data;
};

//Auth API
export const signupUser = (userData) => apiCall('/api/auth/signup', 'POST', userData);
export const getMe = () => apiCall('/api/auth/me');
export const getAllPitches = () => apiCall('/api/pitches');
export const getPitchById = (id) => apiCall(`/api/pitches/${id}`);
export const createPitch = (pitchData) => apiCall('/api/pitches', 'POST', pitchData);
export const updatePitch = (id, pitchData) => apiCall(`/api/pitches/${id}`, 'PUT', pitchData);
export const deletePitch = (id) => apiCall(`/api/pitches/${id}`, 'DELETE')