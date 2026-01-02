import { Property } from '../types/property';

export const properties: Property[] = [
    {
        id: '1',
        title: 'Modern Apartment in Gangnam',
        description: 'Luxurious apartment with city view',
        address: '123 Teheran-ro, Gangnam-gu, Seoul',
        price: 1500000000,
        area: 85,
        type: 'APARTMENT',
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        title: 'Cozy House in Mapo',
        description: 'Beautiful house with a small garden',
        address: '456 Mapo-daero, Mapo-gu, Seoul',
        price: 900000000,
        area: 120,
        type: 'HOUSE',
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
