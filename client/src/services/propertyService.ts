import { Property } from '@/types/property';

const API_URL = '/api';

export const getProperties = async (): Promise<Property[]> => {
    // For server components, we need a full URL. Client components can use relative paths.
    // Simplifying to always use full URL for consistency in this demo.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}${API_URL}/properties`, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }
    return response.json();
};

export const createProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
    });
    if (!response.ok) {
        throw new Error('Failed to create property');
    }
    return response.json();
};

export const updatePropertyStatus = async (id: string, status: string): Promise<Property> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}${API_URL}/properties/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update property status');
    }
    return response.json();
};

export const deleteProperty = async (id: string): Promise<void> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}${API_URL}/properties/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete property');
    }
};
