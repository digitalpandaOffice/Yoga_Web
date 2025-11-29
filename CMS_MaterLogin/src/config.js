export const API_BASE_URL = 'http://localhost/Yoga_Web/Yoga_Backend';

export const endpoints = {
    login: `${API_BASE_URL}/auth/login`,
    forgotPassword: `${API_BASE_URL}/auth/forgotPassword`,
    resetPassword: `${API_BASE_URL}/auth/resetPassword`,
    courses: `${API_BASE_URL}/courses`,
    settings: `${API_BASE_URL}/settings`,
    content: `${API_BASE_URL}/content/home`,
    syllabusContent: `${API_BASE_URL}/content/syllabus`,
    resultsContent: `${API_BASE_URL}/content/results`,
    resultsList: `${API_BASE_URL}/results`,
    resultsCreate: `${API_BASE_URL}/results/create`,
    resultsDelete: `${API_BASE_URL}/results/delete`,
    mediaList: `${API_BASE_URL}/media`,
    mediaUpload: `${API_BASE_URL}/media/upload`,
    mediaDelete: `${API_BASE_URL}/media/delete`,
    resourcesList: `${API_BASE_URL}/resources`,
    resourcesCreate: `${API_BASE_URL}/resources/create`,
    resourcesDelete: `${API_BASE_URL}/resources/delete`,
    updateContent: `${API_BASE_URL}/content/update`,
};
