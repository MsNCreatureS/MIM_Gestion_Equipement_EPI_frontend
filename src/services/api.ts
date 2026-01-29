import type { LoginResponse, Feedback } from '../types';

const getBaseUrl = () => {
    if (typeof window === 'undefined') return 'http://localhost:3000/api';
    return `http://${window.location.hostname}:3000/api`;
};

const API_URL = getBaseUrl();

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const apiService = {
    login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    submitFeedback: async (data: Partial<Feedback>): Promise<void> => {
        const response = await fetch(`${API_URL}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Public endpoint, no auth needed? Or add if needed.
            // Requirement says "seul le sutilistauer avec le role ADMIN peuvent se connecter au panel".
            // Public form (QR code) -> No login required mentioned for submission, just "les ouvrir vont scanner le QR code et arrivais sur un formaulire".
            // So public access.
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Submission failed');
        }
    },

    getAllFeedback: async (): Promise<Feedback[]> => {
        const response = await fetch(`${API_URL}/feedback`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch feedback');
        }

        return response.json();
    },

    updateStatus: async (id: number, status: string): Promise<void> => {
        const response = await fetch(`${API_URL}/feedback/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update status');
        }
    },

    deleteFeedback: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/feedback/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete feedback');
        }
    },

    getPublicFeedback: async (): Promise<Feedback[]> => {
        const response = await fetch(`${API_URL}/feedback/public`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch public feedback');
        }

        return response.json();
    },

    updateAdminAction: async (id: number, actionAdmin: string): Promise<void> => {
        const response = await fetch(`${API_URL}/feedback/${id}/admin-action`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ action_admin: actionAdmin }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update admin action');
        }
    },

    getFeedbackById: async (id: number): Promise<Feedback> => {
        const response = await fetch(`${API_URL}/feedback/${id}`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch feedback details');
        }

        return response.json();
    },
};
