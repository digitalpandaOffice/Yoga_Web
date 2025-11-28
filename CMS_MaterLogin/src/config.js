export const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';

export const endpoints = {
    login: `${API_BASE_URL}/auth/login`,
    forgotPassword: `${API_BASE_URL}/auth/forgotPassword`,
    resetPassword: `${API_BASE_URL}/auth/resetPassword`,
    courses: `${API_BASE_URL}/courses`,
    settings: `${API_BASE_URL}/settings`,
    content: `${API_BASE_URL}/content/home`,
    updateContent: `${API_BASE_URL}/content/update`,
};
