export interface Property {
    id: string;
    title: string;
    description: string;
    address: string;
    price: number;
    area: number;
    type: 'APARTMENT' | 'HOUSE' | 'COMMERCIAL';
    status: 'AVAILABLE' | 'SOLD' | 'RENTED';
    createdAt: Date;
    updatedAt: Date;
    images: string[];
}
