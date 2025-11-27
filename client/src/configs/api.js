import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Attach Authorization header automatically.
// If a request already has `headers.Authorization`, ensure it uses the `Bearer ` prefix.
api.interceptors.request.use((config) => {
    try {
        const localToken = localStorage.getItem('token');
        const existing = config.headers ? config.headers.Authorization || config.headers.authorization : undefined;

        if (existing) {
            // If header exists but missing Bearer prefix, add it
            if (!existing.startsWith('Bearer ')) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${existing}`,
                };
            }
        } else if (localToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${localToken}`,
            };
        }
    } catch (err) {
        // ignore localStorage errors and proceed without token
    }
    return config;
}, (error) => Promise.reject(error));

export default api;